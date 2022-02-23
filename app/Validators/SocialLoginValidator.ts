import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from 'App/Validators/BaseValidator'
import Role from 'App/Models/Role'
import BusinessRepo from 'App/Repos/BusinessRepo'
import CategoryRepo from 'App/Repos/CategoryRepo'

export default class SocialLoginValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    public schema = schema.create({
        email: schema.string({trim: true}, [
            rules.email({sanitize: true, domainSpecificValidation: true}),
        ]),
        phone: schema.string({}, [
            rules.minLength(8),
            rules.maxLength(20),
            rules.mobile()
        ]),
        client_id: schema.string({trim: true}),
        platform: schema.string({trim: true}),
        device_type: schema.string({trim: true}),
        device_token: schema.string({trim: true}),
        account_type: schema.enum([Role.PARENT,Role.BUSINESS]),
        business_name: schema.string.optional({}, [
            rules.maxLength(35),
            rules.unique({
                table: BusinessRepo.model.table,
                column: 'business_name'
            }),
            rules.requiredWhen('account_type','=',Role.BUSINESS)
        ]),
        website: schema.string.optional({}, [
            rules.url()
        ]),
        category_id: schema.number.optional([
            rules.exists({table: CategoryRepo.model.table, column: 'id'}),
            rules.requiredWhen('account_type','=',Role.BUSINESS)
        ]),
        location: schema.string.optional({trim:false},[
            rules.requiredWhen('account_type','=',Role.BUSINESS)
        ]),
        latitude: schema.number.optional([
            rules.requiredWhen('account_type','=',Role.BUSINESS)
        ]),
        longitude: schema.number.optional([
            rules.requiredWhen('account_type','=',Role.BUSINESS)
        ]),
        city: schema.string.optional({trim:true},[rules.maxLength(255),]),
        state: schema.string.optional({trim:true},[rules.maxLength(255),]),
        zip: schema.string.optional({trim:true},[rules.maxLength(255),]),
    })


}


