import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import User from 'App/Models/User'

export default class Friend extends CommonModel {

	public static STATUSES = {
		REQUESTED: 10,
		ACCEPTED: 20,
		CANCELLED: 30
	}

    @column()
    public id: number
	@column()
	public userId: number
	@column()
	public friendId: number
	@column()
	public status: number

	@belongsTo(() => User, {
		foreignKey: 'friendId'
	})
	public friend: BelongsTo<typeof User>

	@belongsTo(() => User, {
		foreignKey: 'userId'
	})
	public user: BelongsTo<typeof User>
}
