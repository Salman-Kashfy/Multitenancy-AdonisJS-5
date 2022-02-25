import BaseRepo from 'App/Repos/BaseRepo'
import Park from "App/Models/Park";
import { RequestContract } from '@ioc:Adonis/Core/Request'
import Attachment from 'App/Models/Attachment'
import ParkMember from 'App/Models/ParkMember'
import ParkRequest from 'App/Models/ParkRequest'
import constants from 'Config/constants'
import Database from "@ioc:Adonis/Lucid/Database"
import myHelpers from "App/Helpers"

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
            .withScopes((scope) => scope.parkMeta(ctx.auth.user.id))
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

    async hostParks(userId) {
        return this.model.query()
            .withScopes((scope) => scope.parkMeta(userId))
            .where({ userId })
    }

    async myParks(userId) {
        return this.model.query()
            .withScopes((scope) => scope.parkMeta(userId))
            .whereHas('members', (memberQuery) => {
                memberQuery.where('member_id', userId)
            })
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
            .withScopes((scope) => scope.parkMeta(userId))
            .where('id',id).first()
        return row
    }
}
export default new ParkRepo()