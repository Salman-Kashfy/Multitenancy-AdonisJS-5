import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'

export default class VerifyEmailValidator extends BaseValidator{
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        email: schema.string({}, [
            rules.maxLength(100),
            rules.email(),
        ]),
        otpCode: schema.number([]),
    })
}
