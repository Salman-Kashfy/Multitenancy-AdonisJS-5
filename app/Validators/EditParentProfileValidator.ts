import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'

export default class EditParentProfileValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        name: schema.string({ trim: true }, [
            rules.maxLength(35)
        ]),
        zip: schema.string({ trim: true }, [
            rules.maxLength(15)
        ]),
        image: schema.string.optional(),
    })
}
