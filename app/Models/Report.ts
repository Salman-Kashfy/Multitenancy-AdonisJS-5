import { BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import User from "App/Models/User";

export default class Report extends CommonModel {
    static INSTANCE_TYPES = {
        USER: 10,
        POST: 20
    }
    public static STATUSES = {
        PENDING: 10,
        RESOLVED: 20
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
    @column()
    public status: number
    @belongsTo(() => User)
    public user: BelongsTo<typeof User>
    @computed()
    public get typeText() {
        return Object.keys(Report.INSTANCE_TYPES).find(key => Report.INSTANCE_TYPES[key] === this.instanceType);
    }
    @computed()
    public get statusText() {
        return Object.keys(Report.STATUSES).find(key => Report.STATUSES[key] === this.status);
    }
}
