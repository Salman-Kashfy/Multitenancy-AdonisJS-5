import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class ReportValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        instance_type: schema.number([]),
        instance_id: schema.number([]),
        description: schema.string.optional({trim: true}, [rules.maxLength(255),])
    })
}
