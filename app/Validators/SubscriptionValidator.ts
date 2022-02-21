import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class SubscriptionValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }
    public schema = schema.create({
		name: schema.string({trim:true},[rules.maxLength(255),]),
		amount: schema.number.optional([]),

    })
}
