import {rules, schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class RegisterValidator extends BaseValidator{
    constructor (protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        f_name: schema.string({ trim: true }, [
            rules.maxLength(25)
        ]),
        l_name: schema.string({ trim: true }, [
            rules.maxLength(25)
        ]),
        email: schema.string({ trim: true }, [
            rules.maxLength(100),
            rules.email(),
        ]),
        password: schema.string({}, [
            rules.maxLength(50),
            rules.minLength(6)
        ]),
        device_type: schema.enum(
            ['android', 'ios', 'web'] as const
        ),
        device_token: schema.string({ trim: true }, [])
    })
}
