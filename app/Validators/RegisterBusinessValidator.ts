import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import CategoryRepo from 'App/Repos/CategoryRepo'
import BusinessRepo from 'App/Repos/BusinessRepo'

export default class RegisterBusinessValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
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
        business_name: schema.string({}, [
            rules.maxLength(35),
            rules.unique({
                table: BusinessRepo.model.table,
                column: 'business_name'
            })
        ]),
        website: schema.string.optional({}, [
            rules.url()
        ]),
        email: schema.string({}, [
            rules.maxLength(100),
            rules.email(),
        ]),
        phone: schema.string({}, [
            rules.minLength(8),
            rules.maxLength(20),
            rules.mobile()
        ]),
        password: schema.string({}, [
            rules.maxLength(180),
            rules.minLength(6)
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
        device_type: schema.enum(
            ['android', 'ios'] as const
        ),
        device_token: schema.string({ trim: true }, [])
    })
}
