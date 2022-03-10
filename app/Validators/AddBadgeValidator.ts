import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import BadgeRepo from 'App/Repos/BadgeRepo'

export default class AddBadgeValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }
    public schema = schema.create({
		name: schema.string({trim:true},[
		    rules.maxLength(255),
            rules.unique({
                table: BadgeRepo.model.table,
                column: 'name'
            })
        ]),
		image: schema.string({trim:true}),
    })
}
