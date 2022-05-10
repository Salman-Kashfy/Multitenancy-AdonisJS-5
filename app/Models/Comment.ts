import {
	BelongsTo,
	belongsTo,
	column,
	HasMany,
	hasMany, hasOne, HasOne,
	ManyToMany,
	manyToMany,
	ModelQueryBuilderContract,
	scope,
} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import User from "App/Models/User";
import Like from 'App/Models/Like'

type Builder = ModelQueryBuilderContract<typeof Comment>
export default class Comment extends CommonModel {

	public serializeExtras = true

	static MENTION_TYPE = {
		COMMENT:10,
		POST:20,
	}

    @column()
    public id: number
	@column()
	public parentId: number
	@column()
	public userId: number
	@column()
	public postId: number
	@column()
	public comment: string

	@manyToMany(() => User, {
		pivotTable: 'mentions',
		localKey: 'id',
		pivotForeignKey: 'instance_id',
		relatedKey: 'id',
		pivotRelatedForeignKey: 'user_id',
	})
	public mentions: ManyToMany<typeof User>

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>

	@hasMany(() => Comment, {
		foreignKey: 'parentId',
	})
	public children: HasMany<typeof Comment>

	@hasOne(() => Like, {
		foreignKey: 'instanceId',
		onQuery: query => query.where({instance_type: Like.TYPE.COMMENT}),
	})
	public likes: HasOne<typeof Like>

	public static commentRelations = scope((query:Builder,userId) => {
		return query
		.preload('children',(commentQuery) =>{
			commentQuery.preload('user').preload('mentions')
			.preload('likes', (postFavouritesQuery) =>{
				postFavouritesQuery.where('user_id', userId)
			}).withCount('likes')
		}).preload('user').preload('mentions')
		.preload('likes', (postFavouritesQuery) =>{
			postFavouritesQuery.where('user_id', userId)
		}).withCount('likes')
	})
}
