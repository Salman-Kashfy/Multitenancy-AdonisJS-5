import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class NotificationValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }
    public schema = schema.create({
		notifiable_id: schema.number([]),
		message: schema.string.optional({trim:true},[rules.maxLength(250),]),
		referenced_user_id: schema.number([]),
		ref_id: schema.number.optional([]),
		type: schema.string.optional({trim:true},[rules.maxLength(255),]),
		read_at: schema.undefined([]),

    })
}
