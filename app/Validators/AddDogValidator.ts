import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from "App/Validators/BaseValidator";
import BreedRepo from 'App/Repos/BreedRepo'
import GenderRepo from 'App/Repos/GenderRepo'
import SizeRepo from 'App/Repos/SizeRepo'

export default class AddDogValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }
    public schema = schema.create({
		name: schema.string.optional({trim:true},[rules.maxLength(35)]),
		description: schema.string.optional({trim:true},[rules.maxLength(250)]),
		breed_id: schema.number.optional([
			rules.exists({table: BreedRepo.model.table, column: 'id'})
		]),
		gender_id: schema.number.optional([
			rules.exists({table: GenderRepo.model.table, column: 'id'})
		]),
		size_id: schema.number.optional([
			rules.exists({table: SizeRepo.model.table, column: 'id'})
		]),
		dob: schema.date.optional({
			format: 'yyyy-MM-dd'
		},[
			rules.before('today')
		]),
		media: schema.array.optional().members(schema.string())
    })
}
