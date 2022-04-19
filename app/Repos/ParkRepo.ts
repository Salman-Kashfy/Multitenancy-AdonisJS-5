import BaseRepo from 'App/Repos/BaseRepo'
import Park from "App/Models/Park";
import { RequestContract } from '@ioc:Adonis/Core/Request'
import Attachment from 'App/Models/Attachment'
import ParkMember from 'App/Models/ParkMember'
import ParkRequest from 'App/Models/ParkRequest'
import constants from 'Config/constants'
import Database from "@ioc:Adonis/Lucid/Database"
import myHelpers from "App/Helpers"
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import BadgeCriterion from 'App/Models/BadgeCriterion'
import Notification from 'App/Models/Notification'

class ParkRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Park, relations)
        this.model = Park
    }

    async index(orderByColumn = constants.ORDER_BY_COLUMN, orderByValue = constants.ORDER_BY_VALUE, page = 1, perPage = constants.PER_PAGE,ctx) {

        let coordinates:any = ['*'],latitude,longitude,countQuery

        if(ctx.request.input('latitude') && ctx.request.input('longitude')){
            latitude = ctx.request.input('latitude')
            longitude = ctx.request.input('longitude')
            coordinates.push(Database.raw(this.model.distanceQuery,[constants.PARK_DISTANCE_LIMIT,latitude,longitude,latitude]))
        }

        let query = this.model.query()
            .select(...coordinates)
            .withScopes((scope) => scope.parkRelations(ctx.auth.user.id))
            .withScopes((scope) => scope.parkPrivacy(ctx.auth.user.id))

        if(ctx.request.input('keyword')){
            query.where((dogQuery) =>{
                dogQuery.where('title','like',`%${ctx.request.input('keyword')}%`)
                    .orWhere('description','like',`%${ctx.request.input('keyword')}%`)
            })
        }
        if(ctx.request.input('latitude') && ctx.request.input('longitude')){
            query.having('distance','<=',constants.PARK_RADIUS)
        }
        countQuery = query
        const total = await countQuery
        let offset = (page-1)*perPage
        let parks = await query.orderBy(orderByColumn, orderByValue).offset(offset).limit(perPage)
        return myHelpers.formatPages(parks,total.length,page,perPage)
    }

    async store(input, request: RequestContract) {
        let row = await this.model.create(input)
        await ParkMember.create({
            parkId: row.id,
            memberId: input.user_id
        })
        if (request.input('media')) {
            for (let i = 0; i < request.input('media').length; i++) {
                await row.related('attachments').create({
                    instanceId: row.id,
                    instanceType: Attachment.TYPE.PARK,
                    path: request.input('media')[i],
                    mimeType: 'image',
                })
            }
        }

        if(request.input('invite')){
            for (let i = 0; i < request.input('invite').length; i++) {
                await ParkRequest.create({
                    userId:input.user_id,
                    parkId:row.id,
                    memberId:request.input('invite')[i],
                    type:ParkRequest.TYPE.INVITE,
                })
            }
        }

        return row
    }

    async update(id, input, request: RequestContract) {
        let row = await super.update(id, input)
        if (request.input('remove_media')) {
            await Attachment.query().whereIn('id', request.input('remove_media')).update({ 'deleted_at': new Date() })
        }
        if (request.input('media')) {
            for (let i = 0; i < request.input('media').length; i++) {
                await row.related('attachments').create({
                    instanceId: row.id,
                    instanceType: Attachment.TYPE.DOG,
                    path: request.input('media')[i],
                    mimeType: 'image',
                })
            }
        }
        return row
    }

    async delete(id) {
        let row = await this.model.findOrFail(id)
        await row.related('members').query().update({ 'deleted_at': new Date() })
        await row.delete()

    }

    async hostParks(orderByColumn = constants.ORDER_BY_COLUMN, orderByValue = constants.ORDER_BY_VALUE, page = 1, perPage = constants.PER_PAGE,ctx) {
        return this.model.query()
            .withScopes((scope) => scope.parkRelations(ctx.auth.user.id))
            .where({ userId:ctx.auth.user.id })
            .orderBy(orderByColumn, orderByValue)
            .paginate(page, perPage)
    }

    async myParks(orderByColumn = constants.ORDER_BY_COLUMN, orderByValue = constants.ORDER_BY_VALUE, page = 1, perPage = constants.PER_PAGE,ctx) {
        return this.model.query()
            .withScopes((scope) => scope.parkRelations(ctx.auth.user.id))
            .whereHas('members', (memberQuery) => {
                memberQuery.where('member_id', ctx.auth.user.id)
            })
            .orderBy(orderByColumn, orderByValue)
            .paginate(page, perPage)
    }

    async join(park, userId) {
        if(park.privacy){
            await ParkRequest.create({
                parkId: park.id,
                userId: park.userId,
                memberId: userId,
                type:ParkRequest.TYPE.REQUEST
            })
        }else{
            await ParkMember.create({
                parkId: park.id,
                memberId: userId,
            })
            /* Send badge to park owner (If applicable) */
            await this.sendBadge(park.id)
        }

        /*
        * Send notification here
        * */

        return {
            status: true,
            message: park.privacy ? "Request Sent Successfully!" : "Park Joined Successfully"
        }
    }

    async acceptDeclineRequest(parkRequest,accept){
        await ParkRequest.query().where({parkId:parkRequest.parkId,memberId:parkRequest.memberId}).delete()
        if(accept){
            await ParkMember.create({
                parkId: parkRequest.parkId,
                memberId: parkRequest.memberId,
            })
        }

        /*
        * Send badge to park owner (If applicable)
        * */
        if(accept){
            await this.sendBadge(parkRequest.parkId)
        }


        /*
        * Send notification here
        * */

        return {
            status: true,
            message: accept ? "Request Accepted Successfully!" : "Request Declined Successfully"
        }
    }

    async unjoin(parkId,userId){
        return ParkMember.query().where('park_id',parkId).where('member_id',userId).delete()
    }

    async block(park,userId){
        await this.unjoin(park.id,userId)
        await park.related('blockedUsers').sync([userId],false)
    }

    async getBlockList(parkId){
        return this.model.query()
            .where('id',parkId)
            .preload('blockedUsers')
    }

    async parkDetails(id,userId) {
        let row = this.model.query()
            .withScopes((scope) => scope.parkRelations(userId))
            .where('id',id).first()
        return row
    }

    async filterNonParkMember(user,parkId){
        if(typeof parkId !== 'object'){
            parkId = [parkId]
        }
        const count = await ParkMember.query().where('member_id',user.id).whereIn('park_id',parkId).getCount('park_id as count').first()
        if(!count.$extras.count){
            throw new ExceptionWithCode('You are not a member of this park',200)
        }
    }

    async sendBadge(parkId) {
        const park = await this.model.find(parkId)
        const user = await User.find(park.userId)
        if(!user) return
        const role = await user.related('roles').query().where('role_id',Role.BUSINESS).first()
        if(!role) return

        let userBadges = await user.related('badges').query()
        let userBadgeIds = userBadges.map(function(badge) {
            return badge.id
        })

        let query = BadgeCriterion.query().where('role_id', role.id).where('host_member_count', '>', 0)
        if (userBadgeIds.length) {
            query.whereNotIn('badge_id', userBadgeIds)
        }
        const badgeCriteria = await query
        if (badgeCriteria.length) {
            const count = await ParkMember.query().where({ parkId: parkId }).getCount('member_id as count').first()
            for (let badgeCriterion of badgeCriteria) {
                if(count.$extras.count >= badgeCriterion.hostMemberCount){
                    await user.related('badges').sync([badgeCriterion.badgeId],false)
                    const notification_message = "Congratulation! You have earned a new badge!"
                    myHelpers.sendNotificationStructure(user.id, badgeCriterion.badgeId, Notification.TYPES.BADGE_EARNED, user.id, null, notification_message)
                    break;
                }
            }
        }
    }
}
export default new ParkRepo()