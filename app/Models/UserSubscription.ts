import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import { DateTime } from 'luxon'

export default class UserSubscription extends CommonModel {

    static SUBSCRIPTION_RECOVERED              = 1;
    static SUBSCRIPTION_RENEWED                = 2;
    static SUBSCRIPTION_CANCELED               = 3;
    static SUBSCRIPTION_PURCHASED              = 4;
    static SUBSCRIPTION_ON_HOLD                = 5;
    static SUBSCRIPTION_IN_GRACE_PERIOD        = 6;
    static SUBSCRIPTION_RESTARTED              = 7;
    static SUBSCRIPTION_PRICE_CHANGE_CONFIRMED = 8;
    static SUBSCRIPTION_DEFERRED               = 9;
    static SUBSCRIPTION_PAUSED                 = 10;
    static SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED = 11;
    static SUBSCRIPTION_REVOKED                = 12;
    static SUBSCRIPTION_EXPIRED                = 13;

    @column()
    public userId: number
	@column()
	public platform: string
    @column()
	public amount: number
    @column()
	public currency: string
    @column.date()
    public expiryDate: DateTime
    @column()
    public transactionReference: string
    @column()
    public data: string

}
