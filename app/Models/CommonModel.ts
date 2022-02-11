import {BaseModel, column, computed} from '@ioc:Adonis/Lucid/Orm'
import {DateTime} from "luxon";
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'

export default class CommonModel extends compose(BaseModel, SoftDeletes) {

    @computed()
    public get created_ago() {
        if(this.createdAt){
            // @ts-ignore
            let difference = new Date().getTime() - new Date(this.createdAt).getTime()
            return DateTime.now().minus({milliseconds: difference}).toRelativeCalendar()
        }
        return null
    }

    @column.dateTime({autoCreate: true})
    public createdAt: DateTime

    @column.dateTime({autoCreate: true, autoUpdate: true})
    public updatedAt: DateTime
}
