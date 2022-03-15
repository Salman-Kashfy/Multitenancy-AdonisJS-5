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
import Friend from 'App/Models/Friend'
import Report from 'App/Models/Report'

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
		Object.values(Like.REACTION).forEach((value:any) => {
			query.withCount('likes',(likesCount) =>{
				likesCount.as(`${value}`).where('reaction',value)
			}).withCount('likes',(likesCount) =>{
				likesCount.as(`${value}`).where('reaction',value)
			})
		});
		return query
	})

	@belongsTo(() => Post, {
		foreignKey: 'sharedPostId',
	})
	public originalPost: BelongsTo<typeof Post>

	public static fetchPost = scope((query:Builder,userID) => {
		query.withScopes((scope) => scope.postMeta(userID)).preload('user')
	})

	public static postMeta = scope((query:Builder,userID) => {
		query.withCount('likes', (likeQuery) =>{
			likeQuery.as('likes_count')
		}).withCount('comments', (commentQuery) =>{
			commentQuery.as('comments_count')
		}).withCount('likes', (likeQuery) =>{
			likeQuery.as('is_liked')
				.where('user_id', userID)
				.where('instance_type', Like.TYPE.POST)
		})
	})

	public static globalPrivacy = scope((query:Builder,userID) =>{
        query.whereHas('user',(userQuery) =>{
            /*
            * For POST (Not Alert)
            * */
            userQuery.where((innerQuery) =>{
                innerQuery.where('posts.type',Post.TYPE.POST)
                 /*
                 * IF Post is public
                 * */
                .where('users.privacy', User.PROFILE.PUBLIC)
                 /*
                 * IF Post is only friends-only
                 * */
                .orWhere((subUserQuery) =>{
                    subUserQuery.where('users.privacy', User.PROFILE.FRIENDS)
                        .where((innerSubquery) =>{
                            innerSubquery.where('id', userID)
                                .orWhereExists((builder) =>{
                                    builder.select('*').from('friends')
                                        .whereRaw(`friends.status = ${Friend.STATUSES.ACCEPTED} AND users.id = friends.user_id AND friends.friend_id = ${userID}`)
                                })
                        })
                })
                 /*
                 * IF Post is only-me
                 * */
                .orWhere((subUserQuery) =>{
                    subUserQuery.where('users.privacy', User.PROFILE.ONLY_ME).where('id', userID)
                })
            })
        }).whereNotExists((builder) => {
            builder.select('*').from('reports')
            .where('reports.user_id', userID).where({instance_type: Report.INSTANCE_TYPES.POST}).whereRaw(`reports.instance_id = posts.id`)
        })
    })

}
