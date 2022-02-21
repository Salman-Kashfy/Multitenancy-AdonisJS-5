import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import NotificationRepo from "App/Repos/NotificationRepo";
import NotificationValidator from "App/Validators/NotificationValidator";
import Attachment from "App/Models/Attachment";


export default class NotificationController extends ApiBaseController {

    constructor() {
        super(NotificationRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number, mediaType?: String) {
        await ctx.request.validate(NotificationValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await NotificationRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()], mediaType)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number, mediaType?: String): Promise<{ data: any; message: string; status: boolean }> {
        await ctx.request.validate(NotificationValidator)
        return super.update(ctx, instanceType, mediaType)
    }

}
