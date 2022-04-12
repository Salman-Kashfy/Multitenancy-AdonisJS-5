import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";

export default class WebhookLog extends CommonModel {
    @column()
    public id: number
	@column()
	public data: string
	@column()
	public platform: string

}
