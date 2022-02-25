import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Role extends BaseModel {

    static ADMIN = 1;
    static PARENT = 2;
    static BUSINESS = 3;

    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public displayName: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
