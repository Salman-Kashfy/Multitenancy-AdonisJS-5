import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import BusinessRepo from 'App/Repos/BusinessRepo'

export default class BusinessExistValidator extends BaseValidator{
	constructor(protected ctx: HttpContextContract){
		super()
	}

	/*
     * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
     *
     * For example:
     * 1. The username must be of data type string. But then also, it should
     *    not contain special characters or numbers.
     *    ```
     *     schema.string({}, [ rules.alpha() ])
     *    ```
     *
     * 2. The email must be of data type string, formatted as a valid
     *    email. But also, not used by any other user.
     *    ```
     *     schema.string({}, [
     *       rules.email(),
     *       rules.unique({ table: 'users', column: 'email' }),
     *     ])
     *    ```
     */
	public schema = schema.create({
		business_name: schema.string({ trim: true }, [
			rules.maxLength(50),
			rules.unique({ table: BusinessRepo.model.table, column: 'business_name' }),
		])
	})
}
