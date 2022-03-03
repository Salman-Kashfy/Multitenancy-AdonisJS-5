import BaseRepo from 'App/Repos/BaseRepo'
import Like from "App/Models/Like";
import {LikeInterface} from "App/Interfaces/LikeInterface";
import Database from "@ioc:Adonis/Lucid/Database"
import Pluralize from 'pluralize';
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import constants from 'Config/constants'
import { DurationUnit } from 'App/Interfaces/DurationObjectUnits'
import { DateTime } from 'luxon'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import BadgeCriterion from 'App/Models/BadgeCriterion'
import Notification from 'App/Models/Notification'
import myHelpers from 'App/Helpers'

class LikeRepo extends BaseRepo {
    model

    constructor() {
        const relations = ['user']
        super(Like, relations)
        this.model = Like
    }

    async index(orderByColumn = constants.ORDER_BY_COLUMN, orderByValue = constants.ORDER_BY_VALUE, page = 1, perPage = constants.PER_PAGE, ctx) {
        let query = this.model.query().orderBy(orderByColumn, orderByValue)
        if (ctx.request.input('post_id', null)) {
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
        if(!request.input('unlike',0)){
            await this.sendBadge(input.user_id)
        }
    }

    async validateInstance(input){
        const key = Object.keys(this.model.TYPE)[Object.values(this.model.TYPE).indexOf(input.instance_type)];
        const record:any = await Database.query().from(Pluralize(key).toLowerCase()).select('id').where('id', input.instance_id).limit(1).first()
        if(!record){
            throw new ExceptionWithCode('Record not found',404)
        }
    }

    async countLikes(input){
        await this.validateInstance(input)
        let likes = await this.model.query().select('reaction').where({
            instance_type: input.instance_type,
            instance_id: input.instance_id
        }).groupBy('reaction').getCount('reaction as count')
        return likes.map((like) => {
            return {
                reaction:like.reaction,
                count:like.$extras.count,
            }
        })
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
        const role = await user.related('roles').query().first()
        if(!role) return

        let userBadges = await user.related('badges').query()
        let userBadgeIds = userBadges.map(function(badge) {
            return badge.id
        })

        if (role.id === Role.PARENT) {
            let query = BadgeCriterion.query().where('role_id', role.id).where('likes_count', '>=', 0)
            if (userBadgeIds.length) {
                query.whereNotIn('badge_id', userBadgeIds)
            }
            const badgeCriteria = await query
            if (badgeCriteria.length) {
                for (let badgeCriterion of badgeCriteria) {
                    const count = await this.countCurrentDurationLikes(userId, badgeCriterion.duration,badgeCriterion.reactionType)
                    let badgeCriterionQuery = BadgeCriterion.query().where('role_id', role.id).where('likes_count', '<=', count).orderBy('likes_count','asc')
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
        }
    }
}

export default new LikeRepo()