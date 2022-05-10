import BaseRepo from 'App/Repos/BaseRepo'
import Comment from "App/Models/Comment";
import { RequestContract } from '@ioc:Adonis/Core/Request'
import constants from 'Config/constants'
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import myHelpers from 'App/Helpers'
import Notification from 'App/Models/Notification'
import User from 'App/Models/User'
import Post from 'App/Models/Post'
import Database from '@ioc:Adonis/Lucid/Database'

class CommentRepo extends BaseRepo {
    model

    constructor() {
        const relations = ['user']
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
            await this.notifyMentions(request.input('mention'),comment)
        }
        await this.notifyTrending(comment)
        return comment
    }

    /*
    * This function handles two cases, mention in post and in comment
    * */
    async notifyMentions(mentions,comment){
        const commentor = await User.find(comment.userId)
        if(!commentor) return

        let type, ref, notification_message
        if(comment.parentId){
            type = Notification.TYPES.MENTION_IN_POST
            ref = 'post'
        }else{
            type = Notification.TYPES.MENTION_IN_COMMENT
            ref = 'comment'
        }
        notification_message = `${commentor.name} mentioned you in a ${ref}.`
        for(let mention of mentions){
            myHelpers.sendNotificationStructure(mention, comment.id, type, comment.userId, null, notification_message)
        }
    }

    async notifyTrending(comment){
        const count = await this.model.query()
            .select(Database.raw('COUNT(DISTINCT user_id) AS count'))
            .where('post_id',comment.postId)
            .whereNull('parent_id')
            .first()
        if(count.$extras.count >= constants.NOTIFY_TRENDING){
            const post = await Post.find(comment.postId)
            if(!post) return
            const notification_message = 'Your post is trending.'
            myHelpers.sendNotificationStructure(post.userId, post.id, Notification.TYPES.POST, post.userId, null, notification_message)
        }
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
        let query = this.model.query()
        if (input.post_id) {
            query = query.where('post_id', input.post_id).where('parent_id', null)
        }
        if (input.parent_id) {
            query = query.where('parent_id', input.parent_id)
        }
        query.withScopes((scope) => scope.commentRelations(ctx?.auth?.user?.id))
        return query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    }
}

export default new CommentRepo()