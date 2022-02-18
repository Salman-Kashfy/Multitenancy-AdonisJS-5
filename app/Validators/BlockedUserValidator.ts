import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import UserRepo from 'App/Repos/UserRepo'

export default class BlockedUserValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }
    public schema = schema.create({
        blocked_user_id: schema.number.optional([
			rules.exists({table: UserRepo.model.table, column: 'id', whereNot:{id:this.ctx?.auth?.user?.id}})
		]),
        unblock: schema.boolean()
    })
}
