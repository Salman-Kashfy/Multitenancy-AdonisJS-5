import BaseRepo from 'App/Repos/BaseRepo'
import Business from "App/Models/Business";


class BusinessRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Business, relations)
        this.model = Business
    }
}

export default new BusinessRepo()