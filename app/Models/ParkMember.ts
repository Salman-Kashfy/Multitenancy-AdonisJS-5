import { column } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from 'App/Models/CommonModel'

export default class ParkMember extends CommonModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public parkId: number

    @column()
    public memberId: number

    @column()
    public status: number


}
