import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'

export default class CustomAlertNotifyValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        radius: schema.number(),
        message: schema.string({trim:true},[rules.maxLength(250)]),
        latitude: schema.number(),
        longitude: schema.number(),
    })
}
