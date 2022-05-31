import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserRole extends BaseModel {
    @column()
    public userId: number
    @column()
    public roleId: number
}
