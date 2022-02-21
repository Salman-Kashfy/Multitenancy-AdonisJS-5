import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'

export default class UserPhoneValidator extends BaseValidator{
    constructor(protected ctx: HttpContextContract) {
		super()
    }

    public schema = schema.create({
		contacts: schema.array().members(
			schema.object.optional().members({
				name: schema.string(),
				phone: schema.string.optional({}, [
					rules.minLength(8),
					rules.maxLength(20),
					rules.mobile()
				]),
				email: schema.string.optional({}, [
					rules.requiredIfNotExists('phone'),
					rules.maxLength(100),
					rules.email(),
				]),
			})
		),
	})
}
