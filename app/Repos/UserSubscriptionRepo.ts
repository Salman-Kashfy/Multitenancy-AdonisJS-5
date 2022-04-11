import BaseRepo from 'App/Repos/BaseRepo'
import UserSubscription from "App/Models/UserSubscription";
import Database from "@ioc:Adonis/Lucid/Database"
import fs from "fs"
import { PubSub } from '@google-cloud/pubsub'

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
            const topic            = 'projects/pc-api-8881935434374400542-836/topics/UBQSubscription';
            const subscriptionName = 'projects/pc-api-8881935434374400542-836/subscriptions/UBQSubscription-sub';
            const project_id       = 'pc-api-8881935434374400542-836';
            const pubsub           = new PubSub({
                'projectId': project_id,
                //'keyFile'  : json,
            });
            const subscription = await pubsub.subscription(subscriptionName);
            subscription.on('message', message => {
                const data = JSON.parse(message.data.toString());
                console.log('Received message:', data);
                if (typeof data.subscriptionNotification !== 'undefined') {
                    const subscriptionData = data.subscriptionNotification;
                    switch (subscriptionData.notificationType) {
                        // case this.repo.model.SUBSCRIPTION_CANCELED:
                        //     app(UsersubscriptionRepository::class)->model()::where('transaction_reference', $subscriptionData->purchaseToken)->update([
                        //     'status' => Usersubscription::STATUS_CANCELLED
                        // ]);
                        //     break;
                        // case this.repo.model.SUBSCRIPTION_EXPIRED:
                        //     app(UsersubscriptionRepository::class)->model()::where('transaction_reference', $subscriptionData->purchaseToken)->update([
                        //     'status' => Usersubscription::STATUS_EXPIRE
                        // ]);
                        //     break;
                        // case this.repo.model.SUBSCRIPTION_ON_HOLD:
                        //     app(UsersubscriptionRepository::class)->model()::where('transaction_reference', $subscriptionData->purchaseToken)->update([
                        //     'status' => Usersubscription::STATUS_HOLD
                        // ]);
                        //     break;
                        // case this.repo.model.SUBSCRIPTION_RENEWED:
                        //     $user_subscription = app(UsersubscriptionRepository::class)->findWhere([
                        //     'transaction_reference' => $subscriptionData->purchaseToken
                        // ])->first();
                        //     if (isset($user_subscription)) {
                        //         $this->saveUserSubscription($user_subscription->user_id, $subscriptionData->purchaseToken, $user_subscription, $subscriptionData);
                        //     }
                        //     break;
                        // default:
                        //     break;
                    }
                }

            });
            //console.log(subscription.on)
        }catch (e) {
            await Database.rollbackGlobalTransaction();
            // WebhookLog::create([
            //     'data'     => $exception->getMessage(),
            //     'platform' => 'android_error'
            // ]);
        }
    }

}

export default new UserSubscriptionRepo()