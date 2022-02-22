import BaseRepo from 'App/Repos/BaseRepo'
import Park from "App/Models/Park";
import { RequestContract } from '@ioc:Adonis/Core/Request'
import Attachment from 'App/Models/Attachment'
import ParkMember from 'App/Models/ParkMember'
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
            parkId:row.id,
            userId:input.user_id,
            memberId:input.user_id
        })
        if (request.input('media')) {
            for (let i = 0; i < request.input('media').length; i++) {
                await row.related('attachments').create({
                    instanceId: row.id,
                    instanceType: Attachment.TYPE.PARK,
                    path:request.input('media')[i],
                    mimeType: 'image',
                })
            }
        }
        return row
    }

    async update(id,input, request: RequestContract) {
        let row = await super.update(id,input)
        if(request.input('remove_media')){
            await Attachment.query().whereIn('id',request.input('remove_media')).update({'deleted_at': new Date()})
        }
        if (request.input('media')) {
            for (let i = 0; i < request.input('media').length; i++) {
                await row.related('attachments').create({
                    instanceId: row.id,
                    instanceType: Attachment.TYPE.DOG,
                    path:request.input('media')[i],
                    mimeType: 'image',
                })
            }
        }
        return row
    }

    async delete(id) {
        let row = await this.model.findOrFail(id)
        await row.related('members').query().update({'deleted_at': new Date()})
        await row.delete()

    }

     async hostParks(userId){
        return this.model.query()
            .withScopes((scope) => scope.parkMeta())
            .where({userId})
    }

    async myParks(userId){
        return this.model.query()
            .withScopes((scope) => scope.parkMeta())
            .whereHas('members',(memberQuery) =>{
                memberQuery.where('member_id',userId)
                    .where('status',this.model.STATUSES.ACCEPTED)
            })
    }

    async join(park,userId,input){
        let response:GlobalResponseInterface = {
            status:true,
            message:"Record Updated Successfully!"
        }
        let object = {
            parkId:park.id,
            userId:park.userId,
            memberId:userId,
        }
        console.log(object,{...object,status:parseInt(input.status)})
        await ParkMember.updateOrCreate(object,{...object,status:parseInt(input.status)})
        return response
    }
}

export default new ParkRepo()