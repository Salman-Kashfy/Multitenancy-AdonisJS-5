import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import UserRepo from 'App/Repos/UserRepo'

export default class CustomPushValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        receiver_id: schema.number([
            rules.exists({table: UserRepo.model.table, column: 'id', where:{'deleted_at':null}})
        ]),
        message: schema.string.optional({trim:true},[rules.maxLength(250)]),
    })
}
