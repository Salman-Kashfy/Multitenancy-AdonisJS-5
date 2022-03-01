import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import LikeRepo from "App/Repos/LikeRepo";
import LikeValidator from "App/Validators/LikeValidator";
import constants from 'Config/constants'

export default class LikeController extends ApiBaseController {
    constructor() {
        super(LikeRepo)
    }

    async index(ctx: HttpContextContract) {
        let page = ctx.request.input('page', 1)
        let perPage = ctx.request.input('per-page', constants.PER_PAGE)
        let orderByColumn = ctx.request.input('order-column', constants.ORDER_BY_COLUMN)
        let orderByValue = ctx.request.input('order', constants.ORDER_BY_VALUE)
        let rows = await LikeRepo.index(orderByColumn, orderByValue, page, perPage, ctx)
        return this.apiResponse('Records fetched successfully', rows)
    }

    async store(ctx: HttpContextContract) {
        let input:any = await ctx.request.validate(LikeValidator)
        await this.repo.validateInstance(input)
        const {user} = ctx.auth
        input.user_id = user?.id
        if (ctx.request.input('unlike',0)) {
            await this.repo.unlike(input)
            return this.apiResponse('Unlike successfully!')
        }
        await LikeRepo.store(input)
        return this.apiResponse('Liked Successfully')
    }

}
