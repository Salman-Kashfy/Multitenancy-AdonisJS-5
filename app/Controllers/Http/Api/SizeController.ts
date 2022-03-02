import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import SizeRepo from "App/Repos/SizeRepo";
import SizeValidator from "App/Validators/SizeValidator";
import Attachment from "App/Models/Attachment";

export default class SizeController extends ApiBaseController {

    constructor() {
        super(SizeRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number, mediaType?: String) {
        await ctx.request.validate(SizeValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await SizeRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()], mediaType)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number, mediaType?: String): Promise<{ data: any; message: string; status: boolean }> {
        await ctx.request.validate(SizeValidator)
        return super.update(ctx, instanceType, mediaType)
    }

    async all(ctx){
        const size = await this.repo.all(ctx)
        return this.apiResponse('Record fetched Successfully', size)
    }

}
