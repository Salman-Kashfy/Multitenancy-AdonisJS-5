import {
	column,
	HasMany,
	hasMany,
	scope,
	ModelQueryBuilderContract,
	manyToMany,
	ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import Attachment from 'App/Models/Attachment'
import User from 'App/Models/User'
import ParkRequest from 'App/Models/ParkRequest'
type Builder = ModelQueryBuilderContract<typeof Park>

export default class Park extends CommonModel {

	public serializeExtras = true

	public static STATUSES = {
		REQUESTED: 10,
		ACCEPTED: 20,
		CANCELLED: 30
	}

	public static fillables(){
		return ['title','description','location','latitude','longitude','city','state','zip','privacy','allowInvite']
	}

	public static distanceQuery = '( ? * acos ( cos ( radians( ? ) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians( ? ) ) + sin ( radians( ? ) ) * sin( radians( latitude ) ) ) ) AS distance'

    @column()
    public id: number
	@column()
	public userId: number
	@column()
	public title: string
	@column()
	public description: string
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
	@column()
	public privacy: boolean
	@column()
	public allowInvite: boolean

	@hasMany(() => Attachment, {
		foreignKey: 'instanceId',
		onQuery: query => query.where({ instanceType: Attachment.TYPE.PARK }).select('id','mimeType','path'),
	})
	public attachments: HasMany<typeof Attachment>

	public static parkRelations = scope((query:Builder,userId) => {
		return query.preload('attachments')
			.preload('parkRequests',(requestQuery) =>{
			 	requestQuery.where('member_id',userId)
			}).withCount('members')
	})

	public static parkPrivacy = scope((query:Builder,userId) => {
		return query.whereDoesntHave('blockedUsers',(builder) =>{
			builder.where('id',userId)
		})
	})

	@manyToMany(() => User, {
		pivotTable: 'park_members',
		localKey: 'id',
		pivotForeignKey: 'park_id',
		relatedKey: 'id',
		pivotRelatedForeignKey: 'member_id',
	})
	public members: ManyToMany<typeof User>

	@manyToMany(() => User, {
		pivotTable: 'park_requests',
		localKey: 'id',
		pivotForeignKey: 'park_id',
		relatedKey: 'id',
		pivotRelatedForeignKey: 'member_id',
	})
	public requests: ManyToMany<typeof User>

	@hasMany(() => ParkRequest)
	public parkRequests: HasMany<typeof ParkRequest>

	@manyToMany(() => User, {
		pivotTable: 'park_blocked_users',
	})
	public blockedUsers: ManyToMany<typeof User>

}