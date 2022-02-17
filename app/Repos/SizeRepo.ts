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

    async all(){
        return this.model.query().select(...Size.select()).orderBy(constants.ORDER_BY_COLUMN,'asc')
    }
}

export default new SizeRepo()