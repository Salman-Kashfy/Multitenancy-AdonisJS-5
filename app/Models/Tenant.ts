import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Tenant extends BaseModel {

    public static connection = 'landlord'

    @column({ isPrimary: true })
    public id: number

    @column()
    public simpillPublicKey: string

    @column()
    public database: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
