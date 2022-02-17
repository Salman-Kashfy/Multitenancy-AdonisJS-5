import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'

export default class UserPhoneValidator extends BaseValidator{
    constructor(protected ctx: HttpContextContract) {
		super()
    }

    public schema = schema.create({
		contacts: schema.array.optional().members(
			schema.object.optional().members({
				name: schema.string(),
				phone: schema.string({}, [
					rules.minLength(8),
					rules.maxLength(20),
					rules.mobile()
				]),
			})
		),
	})
}
