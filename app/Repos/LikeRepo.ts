import BaseRepo from 'App/Repos/BaseRepo'
import Like from "App/Models/Like";
import Comment from "App/Models/Comment";
import Post from "App/Models/Post";
import {LikeInterface} from "App/Interfaces/LikeInterface";
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import constants from 'Config/constants'

class LikeRepo extends BaseRepo {
    model

    constructor() {
        const relations = ['user']
        super(Like, relations)
        this.model = Like
    }

    async index(orderByColumn = constants.ORDER_BY_COLUMN, orderByValue = constants.ORDER_BY_VALUE, page = 1, perPage = constants.PER_PAGE, ctx) {
        let query = this.model.query().orderBy(orderByColumn, orderByValue)
        let likesCount:object[] =[]
        if (ctx.request.input('instance_id', null)  && ctx.request.input('instance_type', null)) {
            likesCount = await this.countLikes(ctx.request.only(['instance_id','instance_type']))
            query = query.where({
                instance_type: ctx.request.input('instance_type'),
                instance_id: ctx.request.input('instance_id')
            })
        }
        if(ctx.request.input('reaction')){
            query.where('reaction',ctx.request.input('reaction'))
        }
        for (let relation of this.relations) await query.preload(relation)
        let likes = await query.paginate(page, perPage)
        likes = likes.serialize({
            fields: {
                pick: ['reaction'],
            },
            relations: {
                user: {
                    fields: '*',
                },
            }
        })
        likes.data = {likesCount:likesCount,likes:likes.data}
        return likes
    }

    async unlike(input:LikeInterface){
        return this.model.query().where(input).delete()
    }

    async store(input) {
        await this.validateInstance(input)
        const data = {
            userId: input.user_id,
            instanceType: input.instance_type,
            instanceId: input.instance_id,
        }
        return await this.model.updateOrCreate(data, input)
    }

    getModelInstance(instanceType){
        switch (instanceType) {
            case this.model.TYPE.COMMENT:
                return Comment
            case this.model.TYPE.POST:
                return Post
            default:
                return false
        }
    }

    async validateInstance(input){
        const model = this.getModelInstance(parseInt(input.instance_type))
        if(model){
            const record = await model.query().select('id').where('id', input.instance_id).limit(1).getCount('id as count').first()
            if(record.$extras.count){
                return
            }
        }
        throw new ExceptionWithCode('Record not found',404)
    }

    async countLikes(input){
        await this.validateInstance(input)
        let likes = await this.model.query().select('reaction').where({
            instance_type: input.instance_type,
            instance_id: input.instance_id
        }).groupBy('reaction').getCount('reaction as count')
        let likesCount = likes.map((like) => {
            return {
                reaction:like.reaction,
                count:like.$extras.count,
            }
        })
        let allLikes = Object.values(this.model.REACTION)
        if(likes.length !== allLikes.length){
            for(let singleLike of allLikes){
                if (! (likes.some(e => e.reaction === singleLike))) {
                    likesCount.push({
                        reaction:singleLike,
                        count:0,
                    })
                }
            }
        }
        return likesCount
    }

}

export default new LikeRepo()