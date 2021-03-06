import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import RoleRepo from "App/Repos/RoleRepo";
import RoleValidator from "App/Validators/RoleValidator";
import Attachment from "App/Models/Attachment";


export default class RoleController extends ApiBaseController {

    constructor() {
        super(RoleRepo)
    }

    async store(ctx: HttpContextContract, instanceType?: number, mediaType?: String) {
        await ctx.request.validate(RoleValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await RoleRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()], mediaType)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number, mediaType?: String): Promise<{ data: any; message: string; status: boolean }> {
        await ctx.request.validate(RoleValidator)
        return super.update(ctx, instanceType, mediaType)
    }

}
