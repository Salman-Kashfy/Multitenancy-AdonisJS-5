import BaseRepo from 'App/Repos/BaseRepo'
import Comment from "App/Models/Comment";
import { RequestContract } from '@ioc:Adonis/Core/Request'

class CommentRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Comment, relations)
        this.model = Comment
    }

    async store(input,request:RequestContract){
        const comment = await this.model.create(input)
        if(request.input('mention') && request.input('mention').length){
            let mentions = {}
            for (let i = 0; i < request.input('mention').length; i++) {
                mentions[request.input('mention')[i]] = {
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
        if(request.input('mention') && request.input('mention').length){
            let mentions = {}
            for (let i = 0; i < request.input('mention').length; i++) {
                mentions[request.input('mention')[i]] = {
                    instance_id: comment.id,
                    instance_type:this.model.MENTION_TYPE.COMMENT
                }
            }
            await comment.related('mentions').sync(mentions)
        }
        return comment
    }
}

export default new CommentRepo()