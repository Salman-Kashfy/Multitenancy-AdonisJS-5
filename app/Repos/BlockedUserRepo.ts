import BaseRepo from 'App/Repos/BaseRepo'
import BlockedUser from "App/Models/BlockedUser";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import constants from 'Config/constants'

class BlockedUserRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(BlockedUser, relations)
        this.model = BlockedUser
    }

    async blockedUsers(
        page = 1,
        perPage = constants.PER_PAGE,
        ctx: HttpContextContract
    ) {
        let query = this.model.query()
        query = query.where('user_id', ctx.auth?.user?.id)
        await query.preload('user')
        let blockedUsers = await query.paginate(page, perPage)
        blockedUsers = blockedUsers.serialize({
            fields: {
                pick: [],
            },
            relations: {
                user: {
                    fields: '*',
                },
            }
        })

        let rows:object[] = []
        blockedUsers.data.map((blockedUser) =>{
            rows.push(blockedUser.user)
        })
        blockedUsers.data = rows
        return blockedUsers
    }

    async blockOrUnblock(blockedDetails){
        return this.model.updateOrCreate(blockedDetails,blockedDetails)
    }
}

export default new BlockedUserRepo()