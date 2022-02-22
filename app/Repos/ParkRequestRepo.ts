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
        console.log('SASAS')
        let query = this.model.query()
            .preload('member',(memberQuery) =>{
                memberQuery.select(...User.select())
            })
            .preload('park')
            .whereHas('park',(parkQuery) =>{
                parkQuery.where('user_id',ctx.auth.user.id)
            })
        let parkRequests = await query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
        return parkRequests
        // return dogs.serialize({
        //     fields: {
        //         pick: [...this.model.select()]
        //     }
        // })
    }
}

export default new ParkRequestRepo()