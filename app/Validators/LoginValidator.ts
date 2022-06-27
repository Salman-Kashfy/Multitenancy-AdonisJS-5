import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'

export default class LoginValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        email: schema.string.optional({}, [
            rules.maxLength(100),
            rules.email(),
        ]),
        phone: schema.string.optional({}, [
            rules.requiredIfNotExists('email'),
            rules.maxLength(20),
        ]),
        password: schema.string({ trim: true }, []),
        device_type: schema.enum( ['android','ios','web'] as const),
        device_token: schema.string({}),
    })
}
