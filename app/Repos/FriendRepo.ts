import BaseRepo from 'App/Repos/BaseRepo'
import Friend from "App/Models/Friend";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import constants from 'Config/constants'

class FriendRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Friend, relations)
        this.model = Friend
    }

    async index(
        orderByColumn = constants.ORDER_BY_COLUMN,
        orderByValue = constants.ORDER_BY_VALUE,
        page = 1,
        perPage = constants.PER_PAGE,
        ctx: HttpContextContract
    ) {
        let input = ctx.request.all()
        let query = this.model.query().orderBy(orderByColumn, orderByValue)
        if (input.user_id) {
            query = query.where('user_id', input.user_id)
        }
        if (input.friend_id) {
            query = query.where('friend_id', input.friend_id)
        }
        if (input.status) {
            query = query.where('status', input.status)
        }

        query.preload('friend').preload('user')

        if(ctx.request.input('keyword')){
            query.whereHas('friend', (friendQuery) =>{
                friendQuery.where('name','like',`%${ctx.request.input('keyword')}%`)
            })
        }

        if(ctx.request.input('park_id')){
            query.withCount('parkJoined',(parkMemberQuery) =>{
                parkMemberQuery.where('park_id',ctx.request.input('park_id'))
            }).withCount('parkRequest',(parkRequestQuery) =>{
                parkRequestQuery.where('park_id',ctx.request.input('park_id'))
            })
        }
        let result = await query.paginate(page, perPage)
        if(parseInt(input.status) === this.model.STATUSES.ACCEPTED && input.user_id){
            const friendRequestCount = await this.model.query()
                .where('friend_id',input.user_id)
                .where('status',this.model.STATUSES.REQUESTED)
                .getCount('id as count')
                .first()
            result = {friends:result,friendRequestCount:friendRequestCount.$extras.count}
        }

        return result
    }

    async store(input) {
        if(input.status == Friend.STATUSES.REQUESTED){
            await this.model.updateOrCreate({
                user_id: input.user_id,
                friend_id: input.friend_id
            }, input)
        }else{
            // Accepted or Cancelled
            await this.model.query().where((query) => {
                query.where({
                    user_id: input.friend_id,
                    friend_id: input.user_id,
                })
            }).orWhere((query) => {
                query.where({
                    user_id: input.user_id,
                    friend_id: input.friend_id,
                })
            }).delete()

            if (input.status == Friend.STATUSES.ACCEPTED) {
                await this.model.createMany([
                    {
                        user_id: input.friend_id,
                        friend_id: input.user_id,
                        status: Friend.STATUSES.ACCEPTED
                    },{
                        user_id: input.user_id,
                        friend_id: input.friend_id,
                        status: Friend.STATUSES.ACCEPTED
                    }
                ])
            }
        }
        return true
    }

    async destroy(id, ctx) {
        await this.model.query().where({
            user_id: ctx.auth.user.id,
            friend_id: id
        }).delete()
        await this.model.query().where({
            user_id: id,
            friend_id: ctx.auth.user.id
        }).delete()
        return true;
    }

    async all(ctx){
        let query = this.model.query()
            .where('user_id', ctx.auth.user.id)
            .where('status', this.model.STATUSES.ACCEPTED)

        query.preload('friend').preload('user')
        if(ctx.request.input('keyword')){
            query.whereHas('friend', (friendQuery) =>{
                friendQuery.where('name','like',`%${ctx.request.input('keyword')}%`)
            })
        }
        return query
    }
}

export default new FriendRepo()