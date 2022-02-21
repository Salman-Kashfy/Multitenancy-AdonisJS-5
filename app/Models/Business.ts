import { column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import Category from 'App/Models/Category'
import Attachment from 'App/Models/Attachment'

export default class Business extends CommonModel {

	public static fillables = ['business_name','website','location','latitude','longitude','city','state','zip']

    @column()
    public id: number
	@column()
	public userId: number
	@column()
	public businessName: string
	@column()
	public description: string
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

	@hasMany(() => Attachment, {
		foreignKey: 'instanceId',
		onQuery: query => query.where({ instanceType: Attachment.TYPE.BUSINESS }).select('id','mimeType','path'),
	})
	public attachments: HasMany<typeof Attachment>

}
