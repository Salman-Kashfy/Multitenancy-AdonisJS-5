import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import ParkRepo from 'App/Repos/ParkRepo'
import UserRepo from 'App/Repos/UserRepo'

export default class AddParkValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }
    public schema = schema.create({
		title: schema.string({trim:true},[
			rules.maxLength(50),
			rules.unique({
                table: ParkRepo.model.table,
                column: 'title'
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
		invite: schema.array.optional().members(schema.number([
			rules.exists({table: UserRepo.model.table, column: 'id'})
		])),
    })
}
