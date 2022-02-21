import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import BusinessRepo from 'App/Repos/BusinessRepo'
import CategoryRepo from 'App/Repos/CategoryRepo'

export default class EditBusinessProfileValidator extends BaseValidator {

    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
		business_name: schema.string({}, [
			rules.maxLength(35),
			rules.unique({
				table: BusinessRepo.model.table,
				column: 'business_name',
				whereNot: {user_id: this.ctx?.auth?.user?.id}
			})
		]),
		website: schema.string.optional({}, [
			rules.url()
		]),
		category_id: schema.number.optional([
			rules.exists({table: CategoryRepo.model.table, column: 'id'})
		]),
		location: schema.string({}),
		latitude: schema.number.optional([]),
		longitude: schema.number([]),
		city: schema.string.optional({trim:true},[rules.maxLength(255),]),
		state: schema.string.optional({trim:true},[rules.maxLength(255),]),
		zip: schema.string.optional({trim:true},[rules.maxLength(255),]),
	})
}
