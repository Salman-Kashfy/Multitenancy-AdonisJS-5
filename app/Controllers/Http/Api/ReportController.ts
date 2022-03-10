import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ReportRepo from "App/Repos/ReportRepo";
import ReportValidator from "App/Validators/ReportValidator";
import GlobalResponseInterface from "App/Interfaces/GlobalResponseInterface";

export default class ReportController extends ApiBaseController {
    constructor() {
        super(ReportRepo)
    }

    async store(ctx: HttpContextContract) {
        await ctx.request.validate(ReportValidator)
        let input = ctx.request.only(this.repo.fillables())
        input.user_id = ctx.auth?.user?.id
        let row = await ReportRepo.store(input)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number, mediaType?: String): Promise<GlobalResponseInterface> {
        return super.update(ctx, instanceType, mediaType)
    }

}
