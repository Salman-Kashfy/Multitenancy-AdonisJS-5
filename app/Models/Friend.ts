import { BelongsTo, belongsTo, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import User from 'App/Models/User'
import ParkMember from 'App/Models/ParkMember'
import ParkRequest from 'App/Models/ParkRequest'

export default class Friend extends CommonModel {

	public static STATUSES = {
		REQUESTED: 10,
		ACCEPTED: 20,
		CANCELLED: 30
	}

	public serializeExtras = true

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

	@hasOne(() => ParkMember, {
		localKey: 'friendId',
		foreignKey: 'memberId'
	})
	public parkJoined: HasOne<typeof ParkMember>

	@hasOne(() => ParkRequest, {
		localKey: 'friendId',
		foreignKey: 'memberId',
		onQuery: query => query.where({ type: ParkRequest.TYPE.INVITE })
	})
	public parkRequest: HasOne<typeof ParkRequest>


}
