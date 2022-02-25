import BaseRepo from 'App/Repos/BaseRepo'
import Post from "App/Models/Post";
import { RequestContract } from '@ioc:Adonis/Core/Request'
import Attachment from 'App/Models/Attachment'
import { DateTime } from 'luxon'
import Role from 'App/Models/Role'
import Database from '@ioc:Adonis/Lucid/Database'
import PostCriterion from 'App/Models/PostCriterion'
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'

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

    async countCurrentMonthPosts(userId){
        const startDate = DateTime.local().startOf('month').toFormat('yyyy-MM-dd')
        const endDate = DateTime.local().endOf('month').toFormat('yyyy-MM-dd')
        let results = await this.model.query()
            .select(Database.raw('COUNT(id) as count'))
            .where('user_id',userId)
            .whereBetween('created_at',[startDate,endDate])
            .withTrashed()
            .first()
        return results.$extras.count
    }

    async applyPostLimits(user,shareParkIds,hostPark){
        const userRoles = await user.related('roles').query()
        const userRoleIds = userRoles.map(function(role) {
            return role.id;
        });
        const roleId = userRoleIds[0]
        const userSubscription = await user.related('subscription').query().first()
        const postCriteria = await PostCriterion.query().where('role_id',roleId).where('subscription_id',userSubscription.id).first()
        if(!postCriteria){ return }

        const hostParkIds = hostPark.map(function(park) {
            return park.id;
        });
        const count = await this.countCurrentMonthPosts(user.id)
        if(userRoleIds.includes(Role.PARENT)){
            if(postCriteria.postsPerMonth !== -1 && count>=postCriteria.postsPerMonth){
                throw new ExceptionWithCode(`${userSubscription.name} for parent account includes ${postCriteria.postsPerMonth} posts per month. Upgrade your subscription plan for unlimited posting!`,403)
            }
        }else if(userRoleIds.includes(Role.BUSINESS)){
            if(postCriteria.postsPerMonth !== -1 && count>=postCriteria.postsPerMonth && shareParkIds.sort().toString() !== hostParkIds.sort().toString()){
                throw new ExceptionWithCode(`${userSubscription.name} for business account includes ${postCriteria.postsPerMonth} posts per month. Upgrade your subscription plan for unlimited posting!`,403)
            }
        }
    }
}

export default new PostRepo()