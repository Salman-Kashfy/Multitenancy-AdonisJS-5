import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import PostRepo from 'App/Repos/PostRepo'
import UserRepo from 'App/Repos/UserRepo'
import CommentRepo from 'App/Repos/CommentRepo'

export default class AddCommentValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }
    public schema = schema.create({
		parent_id: schema.number.optional([
            rules.exists({table: CommentRepo.model.table, column: 'id'})
        ]),
        post_id: schema.number([
			rules.exists({table: PostRepo.model.table, column: 'id'})
		]),
		comment: schema.string({trim:true},[rules.maxLength(255)]),
        mention: schema.array.optional().members(
            schema.number([
                rules.exists({table: UserRepo.model.table, column: 'id'})
            ])
		),
    })
}
