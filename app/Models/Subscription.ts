import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";

export default class Subscription extends CommonModel {

	public static FREE_PLAN = 1

    @column()
    public id: number
	@column()
	public name: string
	@column()
	public amount: number

}
