import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import NotificationRepo from "App/Repos/NotificationRepo";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import constants from "Config/constants";
import CustomPushValidator from "App/Validators/CustomPushValidator";

export default class NotificationController extends ApiBaseController {

    constructor() {
        super(NotificationRepo)
    }

    async index({request, auth}: HttpContextContract){
        const {user}:any = auth
        let offset = request.input('page', 1)
        let limit = request.input('limit', constants.PER_PAGE)
        let orderBy = request.input('orderBy', 'id')
        let sortBy = request.input('sortBy', 'desc')
        const res = await this.repo.fetchNotifications(user.id,offset,limit,orderBy,sortBy)
        return this.apiResponse("Record fetched successfully!", res)
    }

    async markAllRead({auth}: HttpContextContract){
        const {user}:any = auth
        await this.repo.markAllRead(user.id)
        return this.apiResponse("Marked read successfully!")
    }

    async customPush(ctx: HttpContextContract){
        const input = await ctx.request.validate(CustomPushValidator)
        await this.repo.customPush(input)
        return this.apiResponse("Push sent successfully!")
    }

}
