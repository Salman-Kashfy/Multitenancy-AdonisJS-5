import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import User from "App/Models/User";

export default class Report extends CommonModel {
    static INSTANCE_TYPES = {
        USER: 10,
        POST: 20
    }
    @column()
    public id: number
    @column()
    public userId: number
    @column()
    public instanceType: number
    @column()
    public instanceId: number
    @column()
    public description: string
    @belongsTo(() => User)
    public user: BelongsTo<typeof User>
}
