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
        input = {...input,type:this.model.TYPE.POST}
        let row = await this.model.create(input)

        /*
        * Share this post to parks
        * */
        if(request.input('share_posts') && request.input('share_posts').length){
            let sharedPosts = {}
            for (let i = 0; i < request.input('share_posts').length; i++) {
                sharedPosts[request.input('share_posts')[i]] = {
                    user_id: input.userId
                }
            }
            await row.related('sharedPosts').sync(sharedPosts)
        }

        /*
        * Create attachments
        * */
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

    async update(id,input, request: RequestContract) {
        let row = await super.update(id,input)

        /*
        * Share this post to parks
        * */
        if(request.input('share_posts') && request.input('share_posts').length){
            let sharedPosts = {}
            for (let i = 0; i < request.input('share_posts').length; i++) {
                sharedPosts[request.input('share_posts')[i]] = {
                    user_id: input.userId
                }
            }
            await row.related('sharedPosts').sync(sharedPosts)
        }else{
            await row.related('sharedPosts').sync([])
        }

        /*
        * Remove attachments
        * */
        if(request.input('remove_media')){
            await Attachment.query().whereIn('id',request.input('remove_media')).update({'deleted_at': new Date()})
        }

        /*
        * Create attachments
        * */
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

    async createAlert(input,request:RequestContract){
        input = {...input,type:this.model.TYPE.ALERT}
        let row = await this.model.create(input)

        /*
        * Share this post to parks
        * */
        if(request.input('share_posts') && request.input('share_posts').length){
            let sharedPosts = {}
            for (let i = 0; i < request.input('share_posts').length; i++) {
                sharedPosts[request.input('share_posts')[i]] = {
                    user_id: input.userId,
                    created_at: new Date(),
                }
            }
            await row.related('sharedPosts').sync(sharedPosts)
        }

        /*
        * Create attachments
        * */
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