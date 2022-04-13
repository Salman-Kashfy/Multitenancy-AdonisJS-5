import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import RoleRepo from 'App/Repos/RoleRepo'

export default class EditUserValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        roles: schema.array().members(
            schema.number([
                rules.exists({table: RoleRepo.model.table, column: 'id'})
            ]),
        ),
        name: schema.string({trim: true}, [rules.maxLength(80)]),
        phone: schema.string({trim: true}, [rules.maxLength(15)]),
        country_code: schema.string({trim: true}, [rules.maxLength(5)]),
        password: schema.string.optional({trim: true}, [
            rules.minLength(6),
        ]),
        is_blocked: schema.boolean.optional(),
    })
}
