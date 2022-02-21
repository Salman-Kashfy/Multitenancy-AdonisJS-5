import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import ParkRepo from 'App/Repos/ParkRepo'

export default class EditParkValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }
    public schema = schema.create({
		title: schema.string({trim:true},[
			rules.maxLength(50),
			rules.unique({
                table: ParkRepo.model.table,
                column: 'title',
				whereNot: {id:this.ctx.request.param('id')}
            })
		]),
		description: schema.string.optional({trim:true},[rules.maxLength(250)]),
		location: schema.string({trim:true},[rules.maxLength(200)]),
		latitude: schema.number([]),
		longitude: schema.number([]),
		city: schema.string.optional({trim:true},[rules.maxLength(20)]),
		state: schema.string.optional({trim:true},[rules.maxLength(20)]),
		zip: schema.string.optional({trim:true},[rules.maxLength(20)]),
		privacy: schema.boolean(),
		allow_invite: schema.boolean(),
    })
}
