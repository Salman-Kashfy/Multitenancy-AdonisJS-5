import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";

export default class Page extends CommonModel {
    @column()
    public id: number
	@column()
	public slug: string
	@column()
	public title: string
	@column()
	public content: undefined

}
