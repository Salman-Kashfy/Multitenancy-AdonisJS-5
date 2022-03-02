import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from 'App/Models/CommonModel'
import User from 'App/Models/User'

export default class SharedPost extends CommonModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public userId: number

    @column()
    public postId: number

    @column()
    public parkId: number

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>
}