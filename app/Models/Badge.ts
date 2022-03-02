import { column, computed } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import myHelpers from 'App/Helpers'

export default class Badge extends CommonModel {
    @column()
    public id: number
	@column()
	public name: string
	@column()
	public image: string

	@computed()
	public get imagePath() {
		return myHelpers.userImageWithBaseURLOrNotFound(this.image)
	}

}
