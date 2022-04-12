import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import UserSubscriptionRepo from 'App/Repos/UserSubscriptionRepo'

export default class UserSubscriptionsController extends ApiBaseController{

    constructor() {
        super(UserSubscriptionRepo)
    }

    async updateSubscriptionWebhook({request}:HttpContextContract){
        await this.repo.updateSubscriptionWebhook(request.all())
    }
    
    async updateSubscriptionWebhookAndroid(){
        await this.repo.updateSubscriptionWebhookAndroid()
    }

}
