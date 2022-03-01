import BaseRepo from 'App/Repos/BaseRepo'
import Breed from "App/Models/Breed";
import constants from 'Config/constants'

class BreedRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Breed, relations)
        this.model = Breed
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