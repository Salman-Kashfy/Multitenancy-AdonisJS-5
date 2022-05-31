import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Tenant from 'App/Models/Tenant'
import Database from "@ioc:Adonis/Lucid/Database"
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import myHelpers from 'App/Helpers'

export default class SwitchTenant {
    public async handle({request}: HttpContextContract ,next: () => Promise<void>) {
        const tenant = await Tenant.findBy('domain',request.headers().host)
        if(!tenant?.database){
            throw new ExceptionWithCode('Domain/Tenant not found',403)
        }
        const conn = Database.manager.get('tenant')
        //@ts-ignore
        if(!conn?.connection || conn?.config.connection?.database !== tenant?.database){
            myHelpers.setTenantDB(tenant?.database)
        }
        await next()
    }
}