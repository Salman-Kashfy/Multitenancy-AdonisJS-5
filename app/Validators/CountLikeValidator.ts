import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import LikeRepo from 'App/Repos/LikeRepo'

export default class CountLikeValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        instance_id: schema.number([]),
        instance_type: schema.enum(Object.values(LikeRepo.model.TYPE))
    })
}
