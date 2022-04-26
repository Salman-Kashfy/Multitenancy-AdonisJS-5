import BaseRepo from 'App/Repos/BaseRepo'
import Like from "App/Models/Like";
import Post from "App/Models/Post";
import {LikeInterface} from "App/Interfaces/LikeInterface";
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import constants from 'Config/constants'
import { DurationUnit } from 'App/Interfaces/DurationObjectUnits'
import { DateTime } from 'luxon'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import BadgeCriterion from 'App/Models/BadgeCriterion'
import Notification from 'App/Models/Notification'
import myHelpers from 'App/Helpers'
import Comment from 'App/Models/Comment'

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

    async store(input,request) {
        await this.validateInstance(input)
        const data = {
            userId: input.user_id,
            instanceType: input.instance_type,
            instanceId: input.instance_id,
        }

        await this.model.updateOrCreate(data, input)

        // Send Badge on Like (If applicable)
        if(request.input('like',null)){
            await this.sendBadge(input.user_id)

            // Send Push notification
            await this.handleNotifications(data)
        }
    }

    async handleNotifications(data){
        if(parseInt(data.instanceType) === this.model.TYPE.COMMENT){
            const liker = await User.find(data.userId)
            const commentor = await Comment.find(data.instanceId)
            if(!liker || !commentor) return
            const notification_message = `${liker.name} likes on your comment.`
            myHelpers.sendNotificationStructure(commentor.userId, data.instanceId, Notification.TYPES.SOMEONE_LIKE_COMMENT, data.userId, null, notification_message)
        }
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

    async countCurrentDurationLikes(userId, duration:DurationUnit = 'month',reactionType ) {
        const startDate = DateTime.local().startOf(duration).toFormat('yyyy-MM-dd HH:mm:ss')
        const endDate = DateTime.local().endOf(duration).toFormat('yyyy-MM-dd HH:mm:ss')
        let query = this.model.query()
            .where('user_id', userId)
            .whereBetween('created_at', [startDate, endDate])
        if(reactionType){
            query.where('reaction', reactionType)
        }
        const results = await query.getCount('id as count').first()
        return results.$extras.count
    }

    async sendBadge(userId) {
        const user = await User.find(userId)
        if(!user) return
        const role = await user.related('roles').query().where('role_id',Role.PARENT).first()
        if(!role) return

        let userBadges = await user.related('badges').query()
        let userBadgeIds = userBadges.map(function(badge) {
            return badge.id
        })

        let query = BadgeCriterion.query().where('role_id', role.id).where('likes_count', '>=', 0)
        if (userBadgeIds.length) {
            query.whereNotIn('badge_id', userBadgeIds)
        }
        const badgeCriteria = await query
        for (let badgeCriterion of badgeCriteria) {
            const count = await this.countCurrentDurationLikes(userId, badgeCriterion.duration,badgeCriterion.reactionType)
            let badgeCriterionQuery = BadgeCriterion.query().where('role_id', role.id).where('likes_count', '<=', count).orderBy('likes_count','asc')
            if (userBadgeIds.length>0) {
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
}

export default new LikeRepo()