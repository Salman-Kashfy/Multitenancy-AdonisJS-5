import {
	BelongsTo,
	belongsTo,
	column,
	computed,
	HasMany,
	hasMany,
	ManyToMany,
	manyToMany, ModelQueryBuilderContract,
	scope,
} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import Attachment from 'App/Models/Attachment'
import {DateTime} from 'luxon'
import Park from 'App/Models/Park'
import User from 'App/Models/User'
import Like from 'App/Models/Like'
import Comment from 'App/Models/Comment'

type Builder = ModelQueryBuilderContract<typeof Post>

export default class Post extends CommonModel {

	public static TYPE = {
		POST: 10,
		ALERT: 20,
	}

	public static ALERT_TYPE = {
		LOST_DOG: 10,
		FOUND_DOG: 20,
		HEALTH_AND_SAFETY: 30,
	}

    @column()
    public id: number
	@column()
	public userId: number
	@column()
	public description: string
	@column()
	public anonymous: boolean
	@column()
	public type: number
	@column()
	public alertType: number
	@column()
	public pinProfile: boolean
	@column()
	public location: string
	@column()
	public latitude: number
	@column()
	public longitude: number
	@column()
	public city: string
	@column()
	public state: string
	@column()
	public zip: string
	@column()
	public sharedPostId: number

	@computed()
	public get created_ago() {
		if(this.createdAt){
			// @ts-ignore
			let difference = new Date().getTime() - new Date(this.createdAt).getTime()
			return DateTime.now().minus({milliseconds: difference}).toRelativeCalendar()
		}
		return null
	}

	@hasMany(() => Attachment, {
		foreignKey: 'instanceId',
		onQuery: query => query.where({ instanceType: Attachment.TYPE.POST }).select('id','mimeType','path'),
	})
	public attachments: HasMany<typeof Attachment>

	@manyToMany(() => Park,{
        pivotTable: 'shared_posts'
    })
    public sharedPosts: ManyToMany<typeof Park>

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>

	@hasMany(() => Like, {
		foreignKey: 'instanceId',
		onQuery: query => query.where({ instanceType: Like.TYPE.POST })
	})
	public likes: HasMany<typeof Like>

	@hasMany(() => Comment)
	public comments: HasMany<typeof Comment>

	public static postLikeReactionsCount = scope((query:Builder) => {
		Object.keys(Like.REACTION).forEach((key:any) => {
			query.withCount('likes',(likesCount) =>{
				likesCount.as(`${key}`).where('reaction',Like.REACTION[key])
			}).withCount('likes',(likesCount) =>{
				likesCount.as(`${key}`).where('reaction',Like.REACTION[key])
			})
		});
		return query
	})

	@hasMany(() => Post, {
		foreignKey: 'sharedPostId',
	})
	public sharedToProfile: HasMany<typeof Post>

}
