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

	@hasMany(() => Like, {
		foreignKey: 'instanceId',
		onQuery: query => query.select('reaction').where({instance_type: Like.TYPE.COMMENT}),
	})
	public commentLikes: HasMany<typeof Like>

	@hasOne(() => Like, {
		foreignKey: 'instanceId',
		onQuery: query => query.select('reaction').where({instance_type: Like.TYPE.COMMENT}),
	})
	public is_liked: HasOne<typeof Like>

	public static commentRelations = scope((query:Builder,userId) => {
		return query.preload('children',(commentQuery) =>{
			commentQuery.preload('mentions').preload('is_liked', (postFavouritesQuery) =>{
				postFavouritesQuery.as('my_likes').where('user_id', userId)
			})
		}).preload('user').preload('mentions')
			.preload('is_liked', (postFavouritesQuery) =>{
				postFavouritesQuery.as('my_likes').where('user_id', userId)
			})
	})
}
