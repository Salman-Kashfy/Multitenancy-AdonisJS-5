import {BaseModel, column} from '@ioc:Adonis/Lucid/Orm'
import {DateTime} from "luxon";
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'

export default class CommonModel extends compose(BaseModel, SoftDeletes) {

    @column.dateTime({autoCreate: true})
    public createdAt: DateTime

    @column.dateTime({autoCreate: true, autoUpdate: true})
    public updatedAt: DateTime
}
