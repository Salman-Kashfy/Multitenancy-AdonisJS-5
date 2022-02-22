import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from 'App/Models/CommonModel'
import User from 'App/Models/User'

export default class ParkMember extends CommonModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public parkId: number

    @column()
    public memberId: number

    @belongsTo(() => User,{
        foreignKey: 'memberId'
    })
    public user: BelongsTo<typeof User>
}
