import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from 'App/Models/CommonModel'
import User from 'App/Models/User'
import Park from 'App/Models/Park'

export default class ParkRequest extends CommonModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public userId: number

    @column()
    public parkId: number

    @column()
    public memberId: number

    @belongsTo(() => User, {
        foreignKey: 'memberId'
    })
    public member: BelongsTo<typeof User>

    @belongsTo(() => Park, {
        foreignKey: 'parkId'
    })
    public park: BelongsTo<typeof Park>
}
