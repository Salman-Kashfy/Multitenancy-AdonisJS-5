import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import {DateTime} from "luxon";

export default class SocialAccount extends CommonModel {
    @column({isPrimary: true})
    public id: number

    @column()
    public user_id: number

    @column()
    public platform: string

    @column()
    public client_id: string

    @column()
    public expired_at: DateTime

}
