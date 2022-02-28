import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import CategoryRepo from "App/Repos/CategoryRepo";
import CategoryValidator from "App/Validators/CategoryValidator";
import Attachment from "App/Models/Attachment";

export default class CategoryController extends ApiBaseController {

    constructor() {
        super(CategoryRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number, mediaType?: String) {
        await ctx.request.validate(CategoryValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await CategoryRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()], mediaType)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number, mediaType?: String): Promise<{ data: any; message: string; status: boolean }> {
        await ctx.request.validate(CategoryValidator)
        return super.update(ctx, instanceType, mediaType)
    }

    async all(){
        const categories = await this.repo.all()
        return this.apiResponse('Record fetched Successfully', categories)
    }

}
