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
        phone: schema.string.optional({}, [
            rules.minLength(6),
            rules.maxLength(20),
        ]),
        country_code: schema.string.optional({}, [
            rules.minLength(2),
            rules.maxLength(3),
            rules.requiredIfExists('phone')
        ]),
        client_id: schema.string({trim: true}),
        platform: schema.string({trim: true}),
        device_type: schema.string({trim: true}),
        device_token: schema.string({trim: true}),
        account_type: schema.enum([Role.PARENT,Role.BUSINESS]),
    })


}


