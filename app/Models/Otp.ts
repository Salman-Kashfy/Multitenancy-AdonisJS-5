import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Otp extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public userId: number

    @column()
    public type: string

    @column()
    public email: string

    @column()
    public phone: string

    @column()
    public code: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime
}
