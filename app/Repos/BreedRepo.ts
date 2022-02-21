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

    async all(){
        return this.model.query().select(...Breed.select()).orderBy(constants.ORDER_BY_COLUMN,'asc')
    }
}

export default new BreedRepo()