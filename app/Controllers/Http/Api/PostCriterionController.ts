import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import PostCriterionRepo from "App/Repos/PostCriterionRepo";
import AddPostCriterionValidator from "App/Validators/AddPostCriterionValidator";
import GlobalResponseInterface from 'App/Interfaces/GlobalResponseInterface'

export default class PostCriterionController extends ApiBaseController {

    constructor() {
        super(PostCriterionRepo)
    }

    async store(ctx: HttpContextContract) {
        await ctx.request.validate(AddPostCriterionValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await PostCriterionRepo.store(input)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract): Promise<GlobalResponseInterface> {
        await ctx.request.validate(AddPostCriterionValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await PostCriterionRepo.update(ctx.request.param('id'),input)
        return this.apiResponse('Record Updated Successfully', row)
    }

}
