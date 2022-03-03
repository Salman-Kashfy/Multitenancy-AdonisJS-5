import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class Like extends BaseModel {

	static REACTION = {
		THUMB:10,
		THOUGHTFUL:20,
	}

	static TYPE = {
		COMMENT:10,
		POST:20,
	}

    @column()
    public id: number
	@column()
	public userId: number
	@column()
	public instanceId: number
	@column()
	public instanceType: number
	@column()
	public reaction: number
	@column.dateTime({autoCreate: true})
	public createdAt: DateTime

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>

}
