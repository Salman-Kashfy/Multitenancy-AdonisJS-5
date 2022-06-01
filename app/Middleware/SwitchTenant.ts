import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Tenant from 'App/Models/Tenant'
import Database from "@ioc:Adonis/Lucid/Database"
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import myHelpers from 'App/Helpers'

export default class SwitchTenant {
    public async handle({request}: HttpContextContract ,next: () => Promise<void>) {
        if(!request.headers().simpill_public_key){
            throw new ExceptionWithCode('Invalid Request. Missing simpill public key.',403)
        }
        const tenant = await Tenant.findBy('simpill_public_key',request.headers().simpill_public_key)
        if(!tenant?.database){
            throw new ExceptionWithCode('Invalid keys provided.',403)
        }
        const conn = Database.manager.get('tenant')
        //@ts-ignore
        if(!conn?.connection || conn?.config.connection?.database !== tenant?.database){
            myHelpers.setTenantDB(tenant?.database)
        }
        await next()
    }
}