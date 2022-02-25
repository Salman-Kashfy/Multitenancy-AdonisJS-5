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

    async all(){
        return this.model.query().orderBy(constants.ORDER_BY_COLUMN,'asc')
    }
}

export default new CategoryRepo()