import BaseRepo from 'App/Repos/BaseRepo'
import ParkMember from "App/Models/ParkMember";

class ParkMemberRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(ParkMember, relations)
        this.model = ParkMember
    }
}

export default new ParkMemberRepo()