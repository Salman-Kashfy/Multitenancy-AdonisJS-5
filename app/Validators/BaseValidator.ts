import {validator} from '@ioc:Adonis/Core/Validator'

export default class BaseValidator {
    constructor() {
    }

    /**
     * Custom messages for validation failures. You can make use of dot notation `(.)`
     * for targeting nested fields and array expressions `(*)` for targeting all
     * children of an array. For example:
     *
     * {
     *   'profile.username.required': 'Username is required',
     *   'scores.*.number': 'Define scores as valid numbers'
     * }
     *
     */

    public reporter = validator.reporters.api

    public messages = {
        '*': (field, rule) => {
            return `${rule} validation error on ${field}`
        },
        required: "The {{field}} is required",
        unique: "The {{field}} has already been taken",
        email: "The email is not valid",
        minLength: "The {{field}} should be at least {{options.minLength}} character long",
        maxLength: "The {{field}} should not greater than {{options.minLength}} character",
        confirmed: "The {{field}} doesn't match",
        otp_code: "The {{field}} is required",
        mobile: "The {{field}} format is invalid",
        "phone.requiredIfNotExists": 'Phone is required',
        'requiredWhen': 'The {{ field }} is required ',
        'build_version.required': 'The build version is required ',
        'base_url.required': 'The base url is required ',
        'app_store_link.required': 'The app store link is required ',
        'dob.before': 'Date of birth cannot have future date.',
    }
}
