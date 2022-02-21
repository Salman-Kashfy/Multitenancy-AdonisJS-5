import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ExceptionWithCodeException from "App/Exceptions/ExceptionWithCodeException";

export default class Premium {
    public async handle({auth}: HttpContextContract, next: () => Promise<void>) {
        const {user}:any = auth
        const subscription = await user.related('subscription').query().first()
        if(!subscription.amount){
            throw new ExceptionWithCodeException("You need a premium subscription to manage a park", 403)
        }
        await next()
    }
}