import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'

export default class SendOtpValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        email: schema.string.optional({}, [
            rules.requiredIfNotExists('phone'),
            rules.maxLength(100),
            rules.email(),
        ])
    })
}
