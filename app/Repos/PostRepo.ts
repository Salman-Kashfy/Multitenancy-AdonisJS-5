import BaseRepo from 'App/Repos/BaseRepo'
import Post from 'App/Models/Post'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import Attachment from 'App/Models/Attachment'
import { DateTime } from 'luxon'
import Role from 'App/Models/Role'
import PostCriterion from 'App/Models/PostCriterion'
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import SharedPost from 'App/Models/SharedPost'
import constants from 'Config/constants'
import BadgeCriterion from 'App/Models/BadgeCriterion'
import { DurationUnit } from 'App/Interfaces/DurationObjectUnits'
import Notification from 'App/Models/Notification'
import myHelpers from 'App/Helpers'
import User from 'App/Models/User'

class PostRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Post, relations)
        this.model = Post
    }

    async createPost(input, request: RequestContract) {
        input = { ...input, type: this.model.TYPE.POST }
        let row = await this.model.create(input)

        /*
        * Share this post to parks
        * */
        if (request.input('share_posts', []).length) {
            let sharedPosts = {}
            for (let sharedPost of request.input('share_posts')) {
                sharedPosts[sharedPost] = {
                    user_id: input.userId,
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
                    path: request.input('media')[i].path,
                    mimeType: request.input('media')[i].mime_type,
                    duration: request.input('media')[i]?.duration || null,
                })
            }
        }

        /*
        * Send Badge (if applicable)
        * */
        await this.sendBadge(row.userId)

        return row
    }

    async update(id, input, request: RequestContract) {
        let row = await super.update(id, input)

        /*
        * Share this post to parks
        * */
        if (request.input('share_posts', []).length) {
            let sharedPosts = {}
            for (let i = 0; i < request.input('share_posts').length; i++) {
                sharedPosts[request.input('share_posts')[i]] = {
                    user_id: input.userId,
                }
            }
            await row.related('sharedPosts').sync(sharedPosts)
        } else {
            await row.related('sharedPosts').sync([])
        }

        /*
        * Remove attachments
        * */
        if (request.input('remove_media')) {
            await Attachment.query().whereIn('id', request.input('remove_media')).update({ 'deleted_at': new Date() })
        }

        /*
        * Create attachments
        * */
        if (request.input('media')) {
            for (let i = 0; i < request.input('media').length; i++) {
                await row.related('attachments').create({
                    instanceId: row.id,
                    instanceType: Attachment.TYPE.POST,
                    path: request.input('media')[i].path,
                    mimeType: request.input('media')[i].mime_type,
                    duration: request.input('media')[i]?.duration || null,
                })
            }
        }
        return row
    }

    async createAlert(input, request: RequestContract) {
        input = { ...input, type: this.model.TYPE.ALERT }
        let row = await this.model.create(input)

        /*
        * Share this post to parks
        * */
        if (request.input('share_posts', []).length) {
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
                    path: request.input('media')[i].path,
                    mimeType: request.input('media')[i].mime_type,
                    duration: request.input('media')[i]?.duration || null,
                })
            }
        }
        return row
    }

    async countCurrentDurationPosts(userId, duration: DurationUnit = 'month') {
        const startDate = DateTime.local().startOf(duration).toFormat('yyyy-MM-dd HH:mm:ss')
        const endDate = DateTime.local().endOf(duration).toFormat('yyyy-MM-dd HH:mm:ss')
        let results = await this.model.query()
            .where('user_id', userId)
            .whereBetween('created_at', [startDate, endDate])
            .withTrashed()
            .getCount('id as count')
            .first()
        return results.$extras.count
    }

    async applyPostLimits(user, shareParkIds, hostPark) {
        const userRoles = await user.related('roles').query()
        const userRoleIds = userRoles.map(function(role) {
            return role.id
        })
        const roleId = userRoleIds[0]
        const userSubscription = await user.related('subscription').query().first()
        const postCriteria = await PostCriterion.query().where('role_id', roleId).where('subscription_id', userSubscription.id).first()
        if (!postCriteria) {
            return
        }

        const hostParkIds = hostPark.map(function(park) {
            return park.id
        })
        const count = await this.countCurrentDurationPosts(user.id)
        if (userRoleIds.includes(Role.PARENT)) {
            if (postCriteria.postsPerMonth !== -1 && count >= postCriteria.postsPerMonth) {
                throw new ExceptionWithCode(`${userSubscription.name} for parent account includes ${postCriteria.postsPerMonth} posts per month. Upgrade your subscription plan for unlimited posting!`, 403)
            }
        } else if (userRoleIds.includes(Role.BUSINESS)) {
            if (postCriteria.postsPerMonth !== -1 && count >= postCriteria.postsPerMonth && shareParkIds.sort().toString() !== hostParkIds.sort().toString()) {
                throw new ExceptionWithCode(`${userSubscription.name} for business account includes ${postCriteria.postsPerMonth} posts per month. Upgrade your subscription plan for unlimited posting!`, 403)
            }
        }
    }

    async filterOriginal(postId) {
        const post = await this.model.find(postId)
        if (!post.type) {
            throw new ExceptionWithCode('You can not share a shared post!', 403)
        }
    }

    async sharePost(postId, input) {
        const post = await this.model.create({
            userId: input.user_id,
            sharedPostId: postId,
            pinProfile: input.pin_profile,
            description: input.description || null,
        })

        /*
        * Share this post to parks
        * */
        if (input.share_posts?.length) {
            let sharedPosts = {}
            for (let sharedPost of input.share_posts) {
                sharedPosts[sharedPost] = {
                    user_id: input.user_id,
                    created_at: new Date(),
                }
            }
            await post.related('sharedPosts').sync(sharedPosts)
        }
    }

    async getShareList(orderByColumn = constants.ORDER_BY_COLUMN, orderByValue: any = constants.ORDER_BY_VALUE, page = 1, perPage = constants.PER_PAGE, ctx) {
        let posts = await SharedPost.query()
            .where('post_id', ctx.request.param('id'))
            .preload('user')
            .orderBy(orderByColumn, orderByValue)
            .paginate(page, perPage)

        let serializedObj = posts.serialize({
            fields: {
                pick: [],
            },
        })

        let rows: string[] = []
        serializedObj.data.map((post) => {
            rows.push(post.user)
        })
        return rows
    }

    async sendBadge(userId) {
        const user = await User.find(userId)
        if(!user) return
        const role = await user.related('roles').query().first()
        if(!role) return

        let userBadges = await user.related('badges').query()
        let userBadgeIds = userBadges.map(function(badge) {
            return badge.id
        })

        if (role.id === Role.PARENT) {
            let query = BadgeCriterion.query().where('role_id', role.id).where('posts_count', '>=', 0)
            if (userBadgeIds.length) {
                query.whereNotIn('badge_id', userBadgeIds)
            }
            const badgeCriteria = await query
            if (badgeCriteria.length) {
                for (let badgeCriterion of badgeCriteria) {
                    const count = await this.countCurrentDurationPosts(userId, badgeCriterion.duration)
                    let badgeCriterionQuery = BadgeCriterion.query().where('role_id', role.id).where('posts_count', '<=', count).orderBy('posts_count','asc')
                    if (userBadgeIds.length) {
                        badgeCriterionQuery.whereNotIn('badge_id', userBadgeIds)
                    }
                    const earned = await badgeCriterionQuery.first()
                    if(earned){
                        await user.related('badges').sync([earned.badgeId],false)
                        const notification_message = "Congratulation! You have earned a new badge!"
                        myHelpers.sendNotificationStructure(userId, earned.badgeId, Notification.TYPES.BADGE_EARNED, userId, null, notification_message)
                        break;
                    }
                }
            }
        } else if(role.id === Role.BUSINESS) {

        }
    }
}

export default new PostRepo()