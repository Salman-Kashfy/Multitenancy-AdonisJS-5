import BaseRepo from 'App/Repos/BaseRepo'
import Comment from "App/Models/Comment";
import { RequestContract } from '@ioc:Adonis/Core/Request'
import constants from 'Config/constants'
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"

class CommentRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Comment, relations)
        this.model = Comment
    }

    async store(input,request:RequestContract){
        const comment = await this.model.create(input)
        if(request.input('mention',[]).length){
            let mentions = {}
            for(let mention of request.input('mention')){
                mentions[mention] = {
                    instance_id: comment.id,
                    instance_type:this.model.MENTION_TYPE.COMMENT
                }
            }
            await comment.related('mentions').sync(mentions)
        }
        return comment
    }

    async update(id,input,request:RequestContract){
        let comment = await super.update(id, input)
        if(request.input('mention',[]).length){
            let mentions = {}
            for(let mention of request.input('mention')){
                mentions[mention] = {
                    instance_id: comment.id,
                    instance_type:this.model.MENTION_TYPE.COMMENT
                }
            }
            await comment.related('mentions').sync(mentions)
        }
        return comment
    }

    async delete(id){
        const comment = await this.model.find(id)
        await comment.delete()
    }

    async index(orderByColumn = constants.ORDER_BY_COLUMN, orderByValue = constants.ORDER_BY_VALUE, page = 1, perPage = constants.PER_PAGE, ctx: HttpContextContract) {
        let input = ctx.request.all()
        let query = this.model.query().orderBy(orderByColumn, orderByValue)
        if (input.post_id) {
            query = query.where('post_id', input.post_id).where('parent_id', null)
        }
        if (input.parent_id) {
            query = query.where('parent_id', input.parent_id)
        }
        query.preload('children',(commentQuery) =>{
            commentQuery.preload('mentions')
        }).preload('user').preload('mentions')

        return await query.paginate(page, perPage)
    }
}

export default new CommentRepo()