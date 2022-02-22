import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import ParkRepo from 'App/Repos/ParkRepo'
import UserRepo from 'App/Repos/UserRepo'

export default class AcceptDeclineParkRequestValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        park_id: schema.number([
            rules.exists({
                table: ParkRepo.model.table, column: 'id'
            })
        ]),
        member_id: schema.number([
            rules.exists({
                table: UserRepo.model.table, column: 'id'
            })
        ]),
        accept: schema.boolean()
    })

}
