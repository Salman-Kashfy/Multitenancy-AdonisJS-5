import { BelongsTo, belongsTo, column, scope } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from 'App/Models/CommonModel'
import User from 'App/Models/User'

export default class Notification extends CommonModel {

    static TYPES = {
        FRIEND_REQUEST: 5,
        FRIEND_ACCEPTED: 10,
        BADGE_EARNED: 15,
        CUSTOM_ALERTS:50
    }

    @column({ isPrimary: true })
    public id: number

    @column()
    public notifiableId: number

    @column()
    public title: string

    @column()
    public message: string

    @column()
    public userId: number

    @column()
    public refId: number

    @column()
    public type: number

    @column()
    public referencedUserId: number

    @column()
    public read_at: string

    public static unreadCount = scope((query, user_id) => {
        query.count('id', 'unread_count').where('notifiable_id', user_id).whereNull('read_at')
    })

    @belongsTo(() => User, {
        foreignKey: 'referencedUserId'
    })
    public user: BelongsTo<typeof User>
}
