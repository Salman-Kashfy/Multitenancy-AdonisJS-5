import { column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import Category from 'App/Models/Category'

export default class Business extends CommonModel {

	public static fillables = ['name','website','location','latitude','longitude','city','state','zip']

    @column()
    public id: number
	@column()
	public userId: number
	@column()
	public name: string
	@column()
	public website: string
	@column()
	public location: string
	@column()
	public latitude: undefined
	@column()
	public longitude: undefined
	@column()
	public city: string
	@column()
	public state: string
	@column()
	public zip: string

	@manyToMany(() => Category,{
		pivotTable: 'business_categories'
	})
	public categories: ManyToMany<typeof Category>

}
