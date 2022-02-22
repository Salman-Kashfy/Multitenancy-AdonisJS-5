import { column } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from 'App/Models/CommonModel'

export default class ParkRequest extends CommonModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public userId: number

    @column()
    public parkId: number

    @column()
    public memberId: number
}
