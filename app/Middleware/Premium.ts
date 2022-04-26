import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
//import ExceptionWithCode from "App/Exceptions/ExceptionWithCode";

export default class Premium {
    public async handle({auth}: HttpContextContract, next: () => Promise<void>) {
        /* Temporarily remove premium check */
        const {user}:any = auth
        const subscription = await user.related('subscription').query().first()
        if(!subscription.amount){
            //throw new ExceptionWithCode("You need a premium subscription to manage a park", 403)
        }
        await next()
    }
}