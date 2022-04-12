import BaseRepo from 'App/Repos/BaseRepo'
import UserSubscription from "App/Models/UserSubscription";
import Database from "@ioc:Adonis/Lucid/Database"
import fs from "fs"
import { PubSub } from '@google-cloud/pubsub'
import { DateTime } from 'luxon'
import WebhookLog from 'App/Models/WebhookLog'
import {decode} from 'jsonwebtoken'

class UserSubscriptionRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(UserSubscription, relations)
        this.model = UserSubscription
    }

    async updateSubscriptionWebhookAndroid(){
        try {
            await Database.beginGlobalTransaction()
            const path = `${process.cwd()}/resources/gcloud-key/gcloud-key.json`
            const json = JSON.parse(fs.readFileSync(path).toString())
            const subscriptionName = 'projects/pc-api-8881935434374400542-836/subscriptions/UBQSubscription-sub';
            const project_id       = 'pc-api-8881935434374400542-836';
            const pubsub           = new PubSub({
                'projectId': project_id,
                'keyFile'  : json,
            });
            const subscription = await pubsub.subscription(subscriptionName);
            subscription.on('message', async message => {
                const data = JSON.parse(message.data.toString());
                console.log('Received message:', data);
                if (typeof data.subscriptionNotification !== 'undefined') {
                    const subscriptionData = data.subscriptionNotification;
                    switch (subscriptionData.notificationType) {
                        case this.model.SUBSCRIPTION_CANCELED:
                            await this.model.where('transaction_reference', subscriptionData.purchaseToken).update({
                                'status': this.model.SUBSCRIPTION_CANCELED
                            });
                            break;
                        case this.model.SUBSCRIPTION_EXPIRED:
                            await this.model.where('transaction_reference', subscriptionData.purchaseToken).update({
                                'status': this.model.SUBSCRIPTION_EXPIRED
                            });
                            break;
                        case this.model.SUBSCRIPTION_ON_HOLD:
                            await this.model.where('transaction_reference', subscriptionData.purchaseToken).update({
                                'status': this.model.SUBSCRIPTION_ON_HOLD
                            });
                            break;
                        case this.model.SUBSCRIPTION_RENEWED:
                            const userSubscription = await this.model.where('transaction_reference', subscriptionData.purchaseToken).first();
                            if (userSubscription) {
                                await this.saveUserSubscription(userSubscription.userId, subscriptionData.purchaseToken, userSubscription, subscriptionData);
                            }
                            break;
                        default:
                            break;
                    }
                }

            });
        }catch (e) {
            await Database.rollbackGlobalTransaction();
            await WebhookLog.create({
                'data'     : e.message,
                'platform' : 'android_error'
            });
        }
    }

    async saveUserSubscription(userId, transactionReference, userSubscription, data){
        let input = {
            user_id:userId,
            amount:2.99,
            expiry_date:DateTime.now().toUTC().plus({months:1}).toFormat('yyyy-MM-dd'),
            transaction_reference:transactionReference,
            currency:userSubscription.currency,
            platform:userSubscription.platform,
            data:JSON.parse(data),
            status:this.model.STATUS_ACTIVE
        }
        await this.model.create(input);
    }

    async updateSubscriptionWebhook(input){
        await WebhookLog.create({
            'data'     : 'ios',
            'platform' : JSON.stringify(input)
        });

        const token = input.signedPayload
        if (token) {
            const decoded           = decode(token);
            const notificationType = decoded.notificationType;
            const transactionInfo  = decode(decoded.data.signedTransactionInfo);
            switch (notificationType) {
                case this.model.IOS_CANCEL:
                    await this.model.where('transaction_reference', transactionInfo.transactionId).update({
                        'status': this.model.STATUS_CANCELLED
                    });
                    break;
                case this.model.IOS_EXPIRED:
                    await this.model.where('transaction_reference', transactionInfo.transactionId).update({
                        'status': this.model.IOS_EXPIRED
                    });
                    break;
                case this.model.IOS_DID_RENEW:
                    const userSubscription = await this.model.where({
                        'transaction_reference': transactionInfo.transactionId
                    });
                    if (userSubscription) {
                        await this.saveUserSubscription(userSubscription.userId, transactionInfo.transactionId, userSubscription, decoded);
                    }
                    break;
                default:
                    break;
            }
        }

    }

}

export default new UserSubscriptionRepo()