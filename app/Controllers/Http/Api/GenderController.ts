import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import GenderRepo from "App/Repos/GenderRepo";
import GenderValidator from "App/Validators/GenderValidator";
import Attachment from "App/Models/Attachment";

export default class GenderController extends ApiBaseController {

    constructor() {
        super(GenderRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number, mediaType?: String) {
        await ctx.request.validate(GenderValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await GenderRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()], mediaType)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number, mediaType?: String): Promise<{ data: any; message: string; status: boolean }> {
        await ctx.request.validate(GenderValidator)
        return super.update(ctx, instanceType, mediaType)
    }

    async all(ctx){
        const gender = await this.repo.all(ctx)
        return this.apiResponse('Record fetched Successfully', gender)
    }

}
