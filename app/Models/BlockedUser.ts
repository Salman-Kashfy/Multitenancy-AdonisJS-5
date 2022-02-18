import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from "App/Models/User";

export default class BlockedUser extends BaseModel {

	static fillables(){
		return ['blocked_user_id']
	}

	@column()
	public userId: number
	@column()
	public blockedUserId: number

	@belongsTo(() => User, {
		foreignKey: 'blockedUserId'
	})
	public user: BelongsTo<typeof User>

}
