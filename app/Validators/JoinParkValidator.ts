import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import ParkRepo from 'App/Repos/ParkRepo'

export default class JoinParkValidator extends BaseValidator{
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        park_id: schema.number([
			rules.exists({
                table: ParkRepo.model.table, column: 'id', whereNot:{user_id:this.ctx?.auth?.user?.id}
			})
		]),
        status: schema.number()
    })

}
