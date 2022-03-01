import BaseRepo from 'App/Repos/BaseRepo'
import Size from "App/Models/Size";
import constants from "Config/constants";

class SizeRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Size, relations)
        this.model = Size
    }

    async all(ctx){
        let query = this.model.query()
        if(ctx.request.input('keyword')){
            query.where('name','like',`%${ctx.request.input('keyword')}%`)
        }
        return query.orderBy(constants.ORDER_BY_COLUMN,'asc').limit(constants.PER_PAGE)
    }
}

export default new SizeRepo()