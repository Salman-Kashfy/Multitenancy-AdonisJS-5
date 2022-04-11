import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import WebhookLogRepo from "App/Repos/WebhookLogRepo";
import WebhookLogValidator from "App/Validators/WebhookLogValidator";
import Attachment from "App/Models/Attachment";


export default class WebhookLogController extends ApiBaseController {

    constructor() {
        super(WebhookLogRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number, mediaType?: String) {
        await ctx.request.validate(WebhookLogValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await WebhookLogRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()], mediaType)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number, mediaType?: String): Promise<{ data: any; message: string; status: boolean }> {
        await ctx.request.validate(WebhookLogValidator)
        return super.update(ctx, instanceType, mediaType)
    }

}
