import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import PostCriterionRepo from "App/Repos/PostCriterionRepo";
import PostCriterionValidator from "App/Validators/PostCriterionValidator";
import Attachment from "App/Models/Attachment";


export default class PostCriterionController extends ApiBaseController {

    constructor() {
        super(PostCriterionRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number, mediaType?: String) {
        await ctx.request.validate(PostCriterionValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await PostCriterionRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()], mediaType)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number, mediaType?: String): Promise<{ data: any; message: string; status: boolean }> {
        await ctx.request.validate(PostCriterionValidator)
        return super.update(ctx, instanceType, mediaType)
    }

}
