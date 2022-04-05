import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import UserRepo from 'App/Repos/UserRepo'

export default class CheckEmailExistValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
		email: schema.string({},[
            rules.email(),
            rules.unique({table: UserRepo.model.table, column: 'email', where:{'deleted_at':null}}),
        ]),
	})
}
