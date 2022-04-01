import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'

export default class ResetPasswordValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        via: schema.enum(
            ['phone', 'email'] as const,
        ),
        email: schema.string.optional({ trim: true }, [
            rules.requiredWhen('via', '=', 'email'),
            rules.maxLength(100),
            rules.email(),
        ]),
        phone: schema.string.optional({ trim: true }, [
            rules.requiredWhen('via', '=', 'phone'),
            rules.maxLength(20),
        ]),
        code: schema.number([]),
        password: schema.string({}, [
            rules.maxLength(180),
            rules.minLength(6),
        ]),
    })
}
