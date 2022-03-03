import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BadgeRepo from "App/Repos/BadgeRepo";
import AddBadgeValidator from "App/Validators/AddBadgeValidator";
import EditBadgeValidator from "App/Validators/EditBadgeValidator";
import GlobalResponseInterface from "App/Interfaces/GlobalResponseInterface";

export default class BadgeController extends ApiBaseController {

    constructor() {
        super(BadgeRepo)
    }

    async store(ctx) {
        await ctx.request.validate(AddBadgeValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await this.repo.store(input, ctx.request)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number, mediaType?: String): Promise<GlobalResponseInterface> {
        await ctx.request.validate(EditBadgeValidator)
        return super.update(ctx, instanceType, mediaType)
    }

}
