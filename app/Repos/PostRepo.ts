import BaseRepo from 'App/Repos/BaseRepo'
import Post from "App/Models/Post";
import { RequestContract } from '@ioc:Adonis/Core/Request'
import Attachment from 'App/Models/Attachment'

class PostRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Post, relations)
        this.model = Post
    }

    async createPost(input,request:RequestContract){
        let row = await this.model.create(input)
        if (request.input('media')) {
            for (let i = 0; i < request.input('media').length; i++) {
                await row.related('attachments').create({
                    instanceId: row.id,
                    instanceType: Attachment.TYPE.POST,
                    path:request.input('media')[i].path,
                    mimeType: request.input('media')[i].mime_type,
                    duration: request.input('media')[i].duration ? request.input('media')[i].duration : null,
                })
            }
        }
        return row
    }

    async updatePost(id,input, request: RequestContract) {
        let row = await super.update(id,input)
        if(request.input('remove_media')){
            await Attachment.query().whereIn('id',request.input('remove_media')).update({'deleted_at': new Date()})
        }
        if (request.input('media')) {
            for (let i = 0; i < request.input('media').length; i++) {
                await row.related('attachments').create({
                    instanceId: row.id,
                    instanceType: Attachment.TYPE.POST,
                    path:request.input('media')[i].path,
                    mimeType: request.input('media')[i].mime_type,
                    duration: request.input('media')[i].duration ? request.input('media')[i].duration : null,
                })
            }
        }
        return row
    }
}

export default new PostRepo()