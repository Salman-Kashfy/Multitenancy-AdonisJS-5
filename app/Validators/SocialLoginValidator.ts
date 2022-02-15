import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import Role from 'App/Models/Role'

export default class SocialLoginValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        email: schema.string({trim: true}, [
            rules.email({sanitize: true, domainSpecificValidation: true}),
        ]),
        client_id: schema.string({trim: true}),
        platform: schema.string({trim: true}),
        device_type: schema.string({trim: true}),
        device_token: schema.string({trim: true}),
        account_type: schema.enum([Role.PARENT,Role.BUSINESS]),
    })


}


