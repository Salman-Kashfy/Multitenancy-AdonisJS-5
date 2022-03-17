import BaseRepo from 'App/Repos/BaseRepo'
import ParkRequest from "App/Models/ParkRequest";
import constants from 'Config/constants'

class ParkRequestRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(ParkRequest, relations)
        this.model = ParkRequest
    }

    async index(orderByColumn = constants.ORDER_BY_COLUMN, orderByValue = constants.ORDER_BY_VALUE, page = 1, perPage = constants.PER_PAGE,ctx) {
        let query = this.model.query()
            .where('type', this.model.TYPE.REQUEST)
            .preload('member')
            .preload('park',(parkQuery) =>{
                parkQuery.preload('attachments')
            })
            .whereHas('park',(parkQuery) =>{
                parkQuery.where('user_id',ctx.auth.user.id)
            })
        if(ctx.request.input('park_id')){
            query.where('park_id',ctx.request.input('park_id'))
        }
        return await query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    }
}

export default new ParkRequestRepo()