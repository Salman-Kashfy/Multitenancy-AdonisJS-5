import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import RoleRepo from 'App/Repos/RoleRepo'
import BadgeRepo from 'App/Repos/BadgeRepo'

export default class BadgeCriterionValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }
    public schema = schema.create({
        role_id: schema.number([
            rules.exists({
                table: RoleRepo.model.table, column: 'id'
            })
        ]),
        badge_id: schema.number([
            rules.exists({
                table: BadgeRepo.model.table, column: 'id'
            })
        ]),
        posts_count: schema.number.optional( [
            rules.requiredIfNotExistsAll(['likes_count','host_member_count']),
        ]),
        likes_count: schema.number.optional([]),
        duration: schema.enum.optional(['month'],[
            rules.requiredIfExistsAny(['posts_count','likes_count']),
        ]),
        reaction_type: schema.number.optional([
            rules.requiredIfExists('likes_count')
        ]),
        host_member_count: schema.number.optional()
    })
}
