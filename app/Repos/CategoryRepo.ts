import BaseRepo from 'App/Repos/BaseRepo'
import Category from "App/Models/Category";


class CategoryRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Category, relations)
        this.model = Category
    }
}

export default new CategoryRepo()