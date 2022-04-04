import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";

export default class SettingValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    title: schema.string({trim: true}, [rules.maxLength(255),]),
    about: schema.string.optional({trim: true}, [rules.maxLength(65535),]),
    phone: schema.string.optional({trim: true}, [rules.maxLength(255),]),
    address: schema.string.optional({trim: true}, [rules.maxLength(255),]),
    app_store_link: schema.string.optional({trim: true}, [rules.maxLength(255),]),
    facebook_link: schema.string.optional({trim: true}, [rules.maxLength(255),]),
    build_version: schema.string({trim: true}, [rules.maxLength(255),]),
    base_url: schema.string.optional({trim: true}, [rules.maxLength(255),]),
    year: schema.number.optional([]),
    sales_tax: schema.number.optional([]),
    commission: schema.number.optional([]),
    penalty_charges: schema.number.optional([]),
  })
}
