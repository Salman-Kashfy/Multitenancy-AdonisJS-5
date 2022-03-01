import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import AttachmentRepo from 'App/Repos/AttachmentRepo'
import ParkRepo from 'App/Repos/ParkRepo'

export default class CreatePostValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }
    public schema = schema.create({
		description: schema.string.optional({trim:true},[rules.maxLength(250)]),
		anonymous: schema.boolean([]),
		pin_profile: schema.boolean(),
		location: schema.string.optional({trim:true},[rules.maxLength(200),]),
		latitude: schema.number.optional([]),
		longitude: schema.number.optional([]),
		city: schema.string.optional({trim:true},[rules.maxLength(20),]),
		state: schema.string.optional({trim:true},[rules.maxLength(20),]),
		zip: schema.string.optional({trim:true},[rules.maxLength(20),]),
		share_posts: schema.array().members(schema.number([
			rules.exists({table: ParkRepo.model.table, column: 'id', where:{'deleted_at':null}})
		])),
		media: schema.array.optional().members(
			schema.object.optional().members({
				mime_type: schema.enum(Object.values(AttachmentRepo.model.MIME_TYPE)),
				path: schema.string(),
				duration: schema.number.optional([
					rules.requiredWhen('mime_type' ,'=',AttachmentRepo.model.MIME_TYPE.VIDEO)
				])
			}),
		),
    })
}
