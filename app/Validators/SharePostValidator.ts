import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ParkRepo from 'App/Repos/ParkRepo'
import BaseValidator from 'App/Validators/BaseValidator'

export default class SharePostValidator extends BaseValidator{
    constructor(protected ctx: HttpContextContract) {
		super()
    }

    public schema = schema.create({
		pin_profile: schema.boolean(),
		share_posts: schema.array().members(schema.number([
			rules.exists({ table: ParkRepo.model.table, column: 'id', where: { 'deleted_at': null } }),
		])),
		description: schema.string.optional({trim:true},[rules.maxLength(250)]),
	})
}
