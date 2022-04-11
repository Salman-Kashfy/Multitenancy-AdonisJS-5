import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import ParkRepo from 'App/Repos/ParkRepo'

export default class ParkExistValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
		title: schema.string({ trim: true }, [
			rules.maxLength(50),
			rules.unique({ table: ParkRepo.model.table, column: 'title' }),
		])
	})
}
