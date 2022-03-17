import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import CategoryRepo from 'App/Repos/CategoryRepo'
import BusinessRepo from 'App/Repos/BusinessRepo'
import UserRepo from 'App/Repos/UserRepo'

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
        username: schema.string.optional({ trim: true }, [
            rules.maxLength(50),
            rules.unique({ table: UserRepo.model.table, column: 'username' }),
        ]),
        website: schema.string.optional({}, [
            rules.url()
        ]),
        email: schema.string({}, [
            rules.maxLength(255),
            rules.email(),
        ]),
        phone: schema.string({}, [
            rules.minLength(8),
            rules.maxLength(15),
            //rules.mobile()
        ]),
        password: schema.string({}, [
            rules.maxLength(255),
            rules.minLength(6)
        ]),
        category: schema.array().members(
            schema.number([
                rules.exists({table: CategoryRepo.model.table, column: 'id'})
            ]),
        ),
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
