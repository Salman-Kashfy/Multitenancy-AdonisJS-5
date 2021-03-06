import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import ExceptionWithCode from "App/Exceptions/ExceptionWithCode";

export default class Admin {
    public async handle({auth}: HttpContextContract, next: () => Promise<void>) {
        // code for middleware goes here. ABOVE THE NEXT CALL
        let user: any = auth.user
        let exists = await User.query().whereHas('roles', (rolesQuery) => {
            rolesQuery.wherePivot('role_id', Role.ADMIN)
        }).where('id', user.id).first()

        if (!exists) {
            throw new ExceptionWithCode("Permission Denied", 403)
        }
        await next()

    }
}
