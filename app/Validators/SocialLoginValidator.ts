import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import Role from 'App/Models/Role'
import UserRepo from 'App/Repos/UserRepo'

export default class SocialLoginValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        email: schema.string({trim: true}, [
            rules.email({sanitize: true, domainSpecificValidation: true}),
        ]),
        username: schema.string.optional({ trim: true }, [
            rules.maxLength(50),
            rules.unique({ table: UserRepo.model.table, column: 'username' }),
        ]),
        phone: schema.string({}, [
            rules.minLength(8),
            rules.maxLength(20),
            rules.mobile()
        ]),
        client_id: schema.string({trim: true}),
        platform: schema.string({trim: true}),
        device_type: schema.string({trim: true}),
        device_token: schema.string({trim: true}),
        account_type: schema.enum([Role.PARENT,Role.BUSINESS]),
    })


}


