import {
	BelongsTo,
	belongsTo,
	column,
	HasMany,
	hasMany,
	ModelQueryBuilderContract,
	scope,
} from '@ioc:Adonis/Lucid/Orm'
import {DateTime} from 'luxon'
import CommonModel from "App/Models/CommonModel";
import Attachment from 'App/Models/Attachment'
import Size from 'App/Models/Size'
import Gender from 'App/Models/Gender'
import Breed from 'App/Models/Breed'
import User from 'App/Models/User'
type Builder = ModelQueryBuilderContract<typeof Dog>
export default class Dog extends CommonModel {

	static fillables() {
		return ['name','description','breed_id','gender_id','size_id','dob']
	}

    @column()
    public id: number
	@column()
	public userId: number
	@column()
	public name: string
	@column()
	public description: string
	@column()
	public breedId: number
	@column()
	public genderId: number
	@column()
	public sizeId: number

	@column.date()
	public dob: DateTime

	@hasMany(() => Attachment, {
		foreignKey: 'instanceId',
		onQuery: query => query.where({ instanceType: Attachment.TYPE.DOG }).select('id','mimeType','path'),
	})
	public attachments: HasMany<typeof Attachment>

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>

	@belongsTo(() => Size)
	public size: BelongsTo<typeof Size>

	@belongsTo(() => Gender)
	public gender: BelongsTo<typeof Gender>

	@belongsTo(() => Breed)
	public breed: BelongsTo<typeof Breed>

	public static dogMeta = scope((query:Builder) => {
		return query
			.preload('attachments')
			.preload('size')
			.preload('gender')
			.preload('breed')
			.preload('user')
	})

}
