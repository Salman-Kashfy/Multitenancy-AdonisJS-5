import BaseController from 'App/Controllers/Http/BaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import constants from 'Config/constants'
import Attachment from 'App/Models/Attachment'


export default class ApiBaseController extends BaseController {
    repo

    constructor(Repo) {
        super()
        this.repo = Repo
    }

    async index(ctx: HttpContextContract) {
        /*
        *OPTIONAL PARAMS
        * page
        * per-page
        * order
        * */

        let page = ctx.request.input('page', 1)
        let perPage = ctx.request.input('per-page', constants.PER_PAGE)
        let orderByColumn = ctx.request.input('order-column', constants.ORDER_BY_COLUMN)
        let orderByValue = ctx.request.input('order', constants.ORDER_BY_VALUE)

        let rows = await this.repo.index(orderByColumn, orderByValue, page, perPage, ctx)
        return this.apiResponse('Records fetched successfully', rows)
    }

    async store(ctx: HttpContextContract, instanceType?: number, mediaType?: String) {
        let input = ctx.request.only(this.repo.fillables())
        let row = await this.repo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()], mediaType)
        return this.apiResponse('Record Added Successfully', row)
    }

    async show(ctx: HttpContextContract) {
        const res = await this.repo.show(ctx.request.param('id'))
        return this.apiResponse('Record fetched successfully!', res)
    }

    async destroy(ctx: HttpContextContract) {
        const res = await this.repo.delete(ctx.request.param('id'))
        return this.apiResponse('Record deleted successfully!', res)
    }

    async update(ctx: HttpContextContract, instanceType?: number, mediaType?: String) {
        let input = ctx.request.only(this.repo.fillables())
        const res = await this.repo.update(ctx.request.param('id'), input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()], mediaType)
        return this.apiResponse('Record updated successfully!', res)
    }


    apiResponse(message: string, data?: any) {
        /*
        * Standard Structured api output
        * */
        return {
            status: true,
            message,
            // data: data ? typeof data.toJSON != 'undefined' ? data.toJSON() : data : null
            data: data || null,
        }
    }
}
