import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserBadge extends BaseModel {
    @column()
    public userId: number
    @column()
    public badgeId: number
}