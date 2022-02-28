import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import PostCriterionRepo from "App/Repos/PostCriterionRepo";
import AddPostCriterionValidator from "App/Validators/AddPostCriterionValidator";
import Attachment from "App/Models/Attachment";

export default class PostCriterionController extends ApiBaseController {

    constructor() {
        super(PostCriterionRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number, mediaType?: String) {
        await ctx.request.validate(AddPostCriterionValidator)
        let input = ctx.request.only(this.repo.fillables())
        await this.repo.restrictIfExist(input.subscription_id,input.role_id)
        let row = await PostCriterionRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()], mediaType)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number, mediaType?: String): Promise<{ data: any; message: string; status: boolean }> {
        await ctx.request.validate(AddPostCriterionValidator)
        let input = ctx.request.only(this.repo.fillables())
        await this.repo.restrictIfExist(input.subscription_id,input.role_id,ctx.request.param('id'))
        return super.update(ctx, instanceType, mediaType)
    }

}
