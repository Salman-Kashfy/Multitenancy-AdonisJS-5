import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserRole extends BaseModel {
    @column()
    public roleId: number

    @column()
    public userId: number
}
