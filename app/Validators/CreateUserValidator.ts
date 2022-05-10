import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import RoleRepo from 'App/Repos/RoleRepo'

export default class CreateUserValidator extends BaseValidator {
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
        email: schema.string({trim: true}, [
            rules.email({sanitize: true}),
            rules.unique({table: 'users', column: 'email'}),
            rules.maxLength(100)
        ]),
        phone: schema.string({trim: true}, [rules.maxLength(15)]),
        country_code: schema.string({trim: true}, [rules.maxLength(5)]),
        password: schema.string({trim: true}, [
            rules.minLength(6),
            rules.confirmed()
        ]),
        dob: schema.date.optional({
            format: 'yyyy-MM-dd',
        },[
            rules.before( 'today')
        ]),
    })
}
