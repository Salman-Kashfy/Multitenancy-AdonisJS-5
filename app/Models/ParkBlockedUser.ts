import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import User from 'App/Models/User'

export default class ParkBlockedUser extends CommonModel {

	@column()
	public parkId: number

	@column()
	public userId: number

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>

}
