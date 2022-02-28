import BaseRepo from 'App/Repos/BaseRepo'
import Gender from "App/Models/Gender";
import constants from 'Config/constants'

class GenderRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Gender, relations)
        this.model = Gender
    }

    async all(ctx){
        let query = this.model.query()
        if(ctx.request.input('keyword')){
            query.where('name','like',`%${ctx.request.input('keyword')}%`)
        }
        return query.orderBy(constants.ORDER_BY_COLUMN,'asc')
    }
}

export default new GenderRepo()