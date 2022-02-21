import BaseRepo from 'App/Repos/BaseRepo'
import Park from "App/Models/Park";
import { RequestContract } from '@ioc:Adonis/Core/Request'
import Attachment from 'App/Models/Attachment'

class ParkRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Park, relations)
        this.model = Park
    }

    async store(input, request: RequestContract) {
        let row = await this.model.create(input)
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

     async myParks(userId){
        return this.model.query()
            .withScopes((scope) => scope.parkMeta())
            .where({userId})
    }
}

export default new ParkRepo()