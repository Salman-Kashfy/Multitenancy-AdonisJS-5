import BaseRepo from 'App/Repos/BaseRepo'
import ParkRequest from "App/Models/ParkRequest";
import constants from 'Config/constants'
import User from 'App/Models/User'
import Park from 'App/Models/Park'

class ParkRequestRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(ParkRequest, relations)
        this.model = ParkRequest
    }

    async index(orderByColumn = constants.ORDER_BY_COLUMN, orderByValue = constants.ORDER_BY_VALUE, page = 1, perPage = constants.PER_PAGE,ctx) {
        let query = this.model.query()
            .preload('member',(memberQuery) =>{
                memberQuery.select(...User.select())
            })
            .preload('park',(parkQuery) =>{
                parkQuery.select(...Park.select()).preload('attachments')
            })
            .whereHas('park',(parkQuery) =>{
                parkQuery
                    .where('user_id',ctx.auth.user.id)
                    .orWhere('member_id',ctx.auth.user.id)
            })
        return await query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    }
}

export default new ParkRequestRepo()