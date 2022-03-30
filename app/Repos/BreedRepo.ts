import BaseRepo from 'App/Repos/BaseRepo'
import Breed from "App/Models/Breed";
import constants from 'Config/constants'
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"

class BreedRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Breed, relations)
        this.model = Breed
    }

    async index(
        orderByColumn = constants.ORDER_BY_COLUMN,
        orderByValue = constants.ORDER_BY_VALUE,
        page = 1,
        perPage = constants.PER_PAGE,
        // @ts-ignore
        ctx: HttpContextContract
    ) {
        let query = this.model.query().orderBy(orderByColumn, orderByValue)
        for (let relation of this.relations) await query.preload(relation)
        if(ctx.request.input('keyword')){
            query.where('name','like',`%${ctx.request.input('keyword')}%`)
        }
        return await query.paginate(page, perPage)
    }

    async all(ctx){
        let query = this.model.query()
        if(ctx.request.input('keyword')){
            query.where('name','like',`%${ctx.request.input('keyword')}%`)
        }
        return query.orderBy(constants.ORDER_BY_COLUMN,'asc').limit(constants.PER_PAGE)
    }
}

export default new BreedRepo()