import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import UserRepo from 'App/Repos/UserRepo'

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
        dob: schema.date.optional({
            format: 'yyyy-MM-dd'
        },[
            rules.before('today')
        ]),
        image: schema.string.optional(),
        profile_picture: schema.string.optional(),
        marital_status: schema.enum.optional(Object.values(UserRepo.model.MARITAL_STATUS)),
        gender: schema.enum.optional(Object.values(UserRepo.model.GENDER)),
        identification: schema.enum.optional(Object.values(UserRepo.model.IDENTIFICATION)),
        profession: schema.string.optional(),
        school: schema.string.optional(),
    })
}
