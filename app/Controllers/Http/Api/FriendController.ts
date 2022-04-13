import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import FriendRepo from "App/Repos/FriendRepo";
import FriendValidator from "App/Validators/FriendValidator";
import User from 'App/Models/User'
import Notification from 'App/Models/Notification'
import Friend from 'App/Models/Friend'
import myHelpers from 'App/Helpers'

export default class FriendController extends ApiBaseController {

    constructor() {
        super(FriendRepo)
    }

    async store(ctx: HttpContextContract) {
        await ctx.request.validate(FriendValidator)
        let input = ctx.request.only(this.repo.fillables())
        input.user_id = ctx.auth?.user?.id
        let row = await FriendRepo.store(input)
        let message: any;
        let ref_user: any;
        let notification_message: string;
        switch (parseInt(input.status)) {
            case Friend.STATUSES.ACCEPTED:
                ref_user = await User.findOrFail(input.user_id)
                notification_message = ref_user.name + " has accepted your friend request"
                myHelpers.sendNotificationStructure(input.friend_id, input.user_id, Notification.TYPES.FRIEND_ACCEPTED, input.user_id, null, notification_message)
                message = "Friend request has been accepted successfully!"
                break;
            case Friend.STATUSES.CANCELLED:
                message = "Friend request has been cancelled successfully!"
                break;
            default:
                notification_message =`${ctx.auth.user?.name} has send you a friend request`
                myHelpers.sendNotificationStructure(input.friend_id, input.user_id, Notification.TYPES.FRIEND_REQUEST, input.user_id, null, notification_message)
                message = "Friend request has been send successfully!"
                break;
        }
        return this.apiResponse(message, row)
    }

    async destroy(ctx: HttpContextContract) {
        const res = await FriendRepo.destroy(ctx.request.param('id'), ctx)
        return this.apiResponse('Unfriend successfully!', res)
    }

    async all(ctx: HttpContextContract) {
        const res = await this.repo.all(ctx)
        return this.apiResponse('Record fetched successfully!', res)
    }

}
