import BaseRepo from 'App/Repos/BaseRepo'
import Comment from "App/Models/Comment";
import { RequestContract } from '@ioc:Adonis/Core/Request'
import constants from 'Config/constants'
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import myHelpers from 'App/Helpers'
import Notification from 'App/Models/Notification'
import User from 'App/Models/User'

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

        // Send notification of comment reply
        if(input.parent_id){
            await this.notifyCommentRespond(input.user_id,input.parent_id)
        }

        return comment
    }

    async notifyCommentRespond(userId,commentId){
        const commentor = await User.find(userId)
        const commentAuthor = await this.model.find(commentId)
        if(!commentor || !commentAuthor || commentAuthor.userId === commentor.id) return
        const notification_message = `${commentor.name} replied to your comment.`
        myHelpers.sendNotificationStructure(commentAuthor.userId, commentId, Notification.TYPES.SOMEONE_REPLIED_COMMENT, commentor.id, null, notification_message)
    }

    // async notifyMentions(userId,commentId,mentions){
    //     const commentor = await User.find(userId)
    //     const commentAuthor = await this.model.find(commentId)
    //     if(!commentor || !commentAuthor || commentAuthor.userId === commentor.id) return
    //     const notification_message = `${commentor.name} replied to your comment.`
    //     console.log(notification_message)
    //     myHelpers.sendNotificationStructure(commentAuthor.userId, commentId, Notification.TYPES.SOMEONE_REPLIED_COMMENT, commentor.id, null, notification_message)
    // }

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
        query.withScopes((scope) => scope.commentRelations(ctx?.auth?.user?.id))
        return await query.paginate(page, perPage)
    }
}

export default new CommentRepo()