import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";

export default class PostCriterion extends CommonModel {
    @column()
    public id: number
	@column()
	public roleId: number
	@column()
	public subscriptionId: number
	@column()
	public postsPerMonth: number

}
