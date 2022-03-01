import BaseRepo from 'App/Repos/BaseRepo'
import Category from "App/Models/Category";
import constants from 'Config/constants'

class CategoryRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Category, relations)
        this.model = Category
    }

    async all(ctx){
        let query = this.model.query()
        if(ctx.request.input('keyword')){
            query.where('name','like',`%${ctx.request.input('keyword')}%`)
        }
        return query.orderBy(constants.ORDER_BY_COLUMN,'asc').limit(constants.PER_PAGE)
    }
}

export default new CategoryRepo()