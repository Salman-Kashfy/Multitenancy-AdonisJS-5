import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";

export default class UserSubscription extends CommonModel {

    @column()
    public userId: number
	@column()
	public subscriptionId: number

}
