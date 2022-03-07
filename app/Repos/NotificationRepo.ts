import BaseRepo from 'App/Repos/BaseRepo'
import Notification from "App/Models/Notification";
import constants from "Config/constants";
import {DateTime} from "luxon";
import myHelpers from 'App/Helpers'
import UserDevice from 'App/Models/UserDevice'

class NotificationRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Notification, relations)
        this.model = Notification
    }

    async fetchNotifications(userID:number,offset:number= 1, limit:number = constants.PER_PAGE, orderBy:string = 'id', sortBy = 'desc') {
        let query = this.model.query().select('id','ref_id','type','message','read_at','referenced_user_id','created_at')
        query.where('notifiable_id', userID)
            .preload('user',(userQuery) =>{
                userQuery.select('id','name','image')
            })
        const notifications = await query.orderBy(orderBy, sortBy).paginate(offset, limit)
        const unreadCount = await this.model.query().withScopes((scopes) => scopes.unreadCount(userID)).first()
        return {
            unreadCount:unreadCount.$extras.unread_count ? unreadCount.$extras.unread_count : 0,
            notifications: notifications
        }
    }

    async markAllRead(userId){
        const date = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
        const data = {
            read_at:date
        }
        return this.model.query().where('notifiable_id',userId).update(data)
    }

    async customPush(input){
        const devices = await UserDevice.query()
            .where('user_id',input.receiver_id)
            .whereHas('user',(userQuery) =>{
                userQuery.where('push_notify',1)
            })
        await myHelpers.sendNotification('',input.message,{},devices)
    }
}

export default new NotificationRepo()