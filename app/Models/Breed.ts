import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";

export default class Breed extends CommonModel {

    @column()
    public id: number
	@column()
	public name: string

}
