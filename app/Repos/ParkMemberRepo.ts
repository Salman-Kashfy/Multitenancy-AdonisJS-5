import BaseRepo from 'App/Repos/BaseRepo'
import ParkMember from "App/Models/ParkMember";
import User from "App/Models/User";

class ParkMemberRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(ParkMember, relations)
        this.model = ParkMember
    }

    async index(ctx){
        let rows = await this.model.query()
            .where('park_id',ctx.request.param('id'))
            .preload('user',(userQuery) =>{
                userQuery.select(...User.select())
            })
        rows = rows.map((user) => {
            return user.serialize({
                fields: {
                    pick: [],
                    relation: ['user']
                }
            }).user
        })
        return rows
    }
}

export default new ParkMemberRepo()