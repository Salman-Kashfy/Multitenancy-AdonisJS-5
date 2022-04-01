import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ReportRepo from "App/Repos/ReportRepo";
import ReportValidator from "App/Validators/ReportValidator";
import GlobalResponseInterface from "App/Interfaces/GlobalResponseInterface";
import constants from "Config/constants";
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'

export default class ReportController extends ApiBaseController {
    constructor() {
        super(ReportRepo)
    }

    async store(ctx: HttpContextContract) {
        await ctx.request.validate(ReportValidator)
        let input = ctx.request.only(this.repo.fillables())
        input.user_id = ctx.auth?.user?.id
        let row = await this.repo.store(input)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number, mediaType?: String): Promise<GlobalResponseInterface> {
        return super.update(ctx, instanceType, mediaType)
    }

    async contentReport(ctx: HttpContextContract) {
        let page = ctx.request.input('page', 1)
        let perPage = ctx.request.input('per-page', constants.PER_PAGE)
        let orderByColumn = ctx.request.input('order-column', constants.ORDER_BY_COLUMN)
        let orderByValue = ctx.request.input('order', constants.ORDER_BY_VALUE)
        let rows = await this.repo.contentReport(orderByColumn, orderByValue, page, perPage, ctx)
        return this.apiResponse('Records fetched successfully', rows)
    }

    async updateContentReport(ctx: HttpContextContract) {
        if(! await this.repo.exist(ctx)){
            throw new ExceptionWithCode('Record not found!',404)
        }
        const input = ctx.request.only(this.repo.fillables())
        const report = await this.repo.updateContentReport(ctx.request.param('id'),input)
        return this.apiResponse('Records updated successfully', report)
    }

}
