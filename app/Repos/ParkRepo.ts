import BaseRepo from 'App/Repos/BaseRepo'
import Park from "App/Models/Park";
import { RequestContract } from '@ioc:Adonis/Core/Request'
import Attachment from 'App/Models/Attachment'
import ParkMember from 'App/Models/ParkMember'
import ParkRequest from 'App/Models/ParkRequest'
import GlobalResponseInterface from 'App/Interfaces/GlobalResponseInterface'

class ParkRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Park, relations)
        this.model = Park
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
            .withScopes((scope) => scope.parkMeta())
            .where({ userId })
    }

    async myParks(userId) {
        return this.model.query()
            .withScopes((scope) => scope.parkMeta())
            .whereHas('members', (memberQuery) => {
                memberQuery.where('member_id', userId)
            })
    }

    async join(park, userId) {
        let response: GlobalResponseInterface
        if(park.privacy){
            await ParkRequest.create({
                parkId: park.id,
                userId: park.userId,
                memberId: userId
            })
        }else{
            await ParkMember.create({
                parkId: park.id,
                memberId: userId,
            })
        }
        response = {
            status: true,
            message: park.privacy ? "Request Sent Successfully!" : "Park Joined Successfully"
        }

        /*
        * Send notification here
        * */

        return response
    }

    async acceptDeclineRequest(parkRequest,accept){
        let response: GlobalResponseInterface
        await ParkRequest.query().where({parkId:parkRequest.parkId,memberId:parkRequest.memberId}).delete()
        if(accept){
            await ParkMember.create({
                parkId: parkRequest.parkId,
                memberId: parkRequest.memberId,
            })
        }
        response = {
            status: true,
            message: accept ? "Request Accepted Successfully!" : "Request Declined Successfully"
        }

        /*
        * Send notification here
        * */

        return response
    }
}
export default new ParkRepo()