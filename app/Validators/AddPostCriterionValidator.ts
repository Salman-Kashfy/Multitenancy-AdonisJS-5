import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import RoleRepo from 'App/Repos/RoleRepo'
import SubscriptionRepo from 'App/Repos/SubscriptionRepo'

export default class AddPostCriterionValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }
    public schema = schema.create({
		role_id: schema.number([
		    rules.exists({
                table: RoleRepo.model.table, column: 'id'
            })
        ]),
		subscription_id: schema.number([
		     rules.exists({
                table: SubscriptionRepo.model.table, column: 'id'
            })
        ]),
		posts_per_month: schema.number([])
    })
}
