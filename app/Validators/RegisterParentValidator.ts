import {rules, schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class RegisterParentValidator extends BaseValidator{
    constructor (protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        name: schema.string({ trim: true }, [
            rules.maxLength(35)
        ]),
        username: schema.string.optional({ trim: true }, [
            rules.maxLength(25)
        ]),
        email: schema.string({ trim: true }, [
            rules.maxLength(100),
            rules.email(),
        ]),
        phone: schema.string({ trim: true }, [
            rules.minLength(8),
            rules.maxLength(20),
            rules.mobile()
        ]),
        password: schema.string({}, [
            rules.maxLength(180),
            rules.minLength(6)
        ]),
        zip: schema.string({ trim: true }, [
            rules.maxLength(15)
        ]),
        device_type: schema.enum(
            ['android', 'ios'] as const
        ),
        device_token: schema.string({ trim: true }, [])
    })
}
