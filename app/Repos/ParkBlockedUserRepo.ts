import BaseRepo from 'App/Repos/BaseRepo'
import ParkBlockedUser from "App/Models/ParkBlockedUser";
import User from 'App/Models/User'

class ParkBlockedUserRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(ParkBlockedUser, relations)
        this.model = ParkBlockedUser
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

export default new ParkBlockedUserRepo()