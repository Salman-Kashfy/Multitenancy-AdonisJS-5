import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ParkRequestRepo from "App/Repos/ParkRequestRepo";
import constants from 'Config/constants'

export default class ParkRequestController extends ApiBaseController {

    constructor() {
        super(ParkRequestRepo)
    }

    async index(ctx:HttpContextContract){
        const page = ctx.request.input('page', 1)
        const perPage = ctx.request.input('per-page', constants.PER_PAGE)
        const orderByColumn = 'created_at'
        const orderByValue = 'desc'
        const category = await this.repo.index(orderByColumn,orderByValue,page,perPage,ctx);
        return this.globalResponse(ctx.response,true,'Record Fetched Successfully',category)
    }

}
