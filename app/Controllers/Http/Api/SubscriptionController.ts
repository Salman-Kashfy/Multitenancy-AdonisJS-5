import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import SubscriptionRepo from "App/Repos/SubscriptionRepo";
import SubscriptionValidator from "App/Validators/SubscriptionValidator";
import Attachment from "App/Models/Attachment";


export default class SubscriptionController extends ApiBaseController {

    constructor() {
        super(SubscriptionRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number, mediaType?: String) {
        await ctx.request.validate(SubscriptionValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await SubscriptionRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()], mediaType)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number, mediaType?: String): Promise<{ data: any; message: string; status: boolean }> {
        await ctx.request.validate(SubscriptionValidator)
        return super.update(ctx, instanceType, mediaType)
    }

}
