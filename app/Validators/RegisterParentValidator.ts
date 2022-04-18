import {rules, schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import UserRepo from 'App/Repos/UserRepo'

export default class RegisterParentValidator extends BaseValidator{
    constructor (protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        name: schema.string({ trim: true }, [
            rules.maxLength(50)
        ]),
        username: schema.string.optional({ trim: true }, [
            rules.maxLength(50),
            rules.unique({ table: UserRepo.model.table, column: 'username' }),
        ]),
        email: schema.string({ trim: true }, [
            rules.maxLength(255),
            rules.email(),
        ]),
        phone: schema.string({ trim: true }, [
            rules.minLength(6),
            rules.maxLength(15),
        ]),
        country_code: schema.string.optional({}, [
            rules.minLength(2),
            rules.maxLength(3),
            rules.requiredIfExists('phone')
        ]),
        password: schema.string({}, [
            rules.maxLength(255),
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
