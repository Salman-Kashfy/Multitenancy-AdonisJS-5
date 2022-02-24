import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import AttachmentRepo from 'App/Repos/AttachmentRepo'
import PostRepo from 'App/Repos/PostRepo'

export default class AddPostValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }
    public schema = schema.create({
		description: schema.string.optional({trim:true},[rules.maxLength(250)]),
		anonymous: schema.boolean([]),
		type: schema.enum(Object.values(PostRepo.model.TYPE)),
		alert_type: schema.enum(Object.values(PostRepo.model.ALERT_TYPE)),
		location: schema.string.optional({trim:true},[rules.maxLength(200),]),
		latitude: schema.number.optional([]),
		longitude: schema.number.optional([]),
		city: schema.string.optional({trim:true},[rules.maxLength(20),]),
		state: schema.string.optional({trim:true},[rules.maxLength(20),]),
		zip: schema.string.optional({trim:true},[rules.maxLength(20),]),
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
