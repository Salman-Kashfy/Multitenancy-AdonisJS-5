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
        let rows = await this.repo.index(orderByColumn, orderByValue, page, perPage, ctx)
        return this.apiResponse('Records fetched successfully', rows)
    }

    async store(ctx: HttpContextContract) {
        let input = await ctx.request.validate(LikeValidator)
        const {user} = ctx.auth
        if (!ctx.request.input('like')) {
            await this.repo.unlike({...input,user_id:user?.id })
            return this.apiResponse('Unlike successfully!')
        }
        await this.repo.store({...input,user_id:user?.id },ctx.request)
        return this.apiResponse('Liked Successfully')
    }

}
