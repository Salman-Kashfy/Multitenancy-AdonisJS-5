import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import PostRepo from 'App/Repos/PostRepo'

export default class HidePostValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        post_id:schema.number([
            rules.exists({ table: PostRepo.model.table, column: 'id', where: { 'deleted_at': null } }),
        ]),
        hide: schema.boolean()
    })
}
