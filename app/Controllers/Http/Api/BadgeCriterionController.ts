import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BadgeCriterionRepo from "App/Repos/BadgeCriterionRepo";
import BadgeCriterionValidator from "App/Validators/BadgeCriterionValidator";
import GlobalResponseInterface from "App/Interfaces/GlobalResponseInterface";

export default class BadgeCriterionController extends ApiBaseController {

    constructor() {
        super(BadgeCriterionRepo)
    }

    async store(ctx: HttpContextContract) {
        await ctx.request.validate(BadgeCriterionValidator)
        const input = ctx.request.only(this.repo.fillables())
        let row = await this.repo.store(input)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract): Promise<GlobalResponseInterface> {
        const input =await ctx.request.validate(BadgeCriterionValidator)
        const row = this.repo.update(ctx.request.param('id'),input)
        return this.apiResponse('Record Added Successfully', row)
    }

}
