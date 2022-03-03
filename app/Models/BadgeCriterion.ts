import { column } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import {DurationUnit} from 'App/Interfaces/DurationObjectUnits'

export default class BadgeCriterion extends CommonModel {
    @column()
    public id: number
    @column()
    public roleId: number
    @column()
    public badgeId: number
    @column()
    public postsCount: number
    @column()
    public likesCount: number
    @column()
    public reactionType: number
    @column()
    public duration: DurationUnit
    @column()
    public hostMemberCount: number
}
