import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ExceptionWithCode from "App/Exceptions/ExceptionWithCode";
import UserSubscriptionRepo from 'App/Repos/UserSubscriptionRepo'

export default class Premium {
    public async handle({auth}: HttpContextContract, next: () => Promise<void>) {
        const {user} = auth
        const userSubscription = await UserSubscriptionRepo.model.query().where('user_id', user?.id).first()
        if(!userSubscription){
            throw new ExceptionWithCode("You need a premium subscription to manage a park", 403)
        }
        await next()
    }
}