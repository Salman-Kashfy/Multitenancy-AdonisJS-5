import BaseRepo from 'App/Repos/BaseRepo'
import Dog from "App/Models/Dog";
import { RequestContract } from "@ioc:Adonis/Core/Request"
import Attachment from 'App/Models/Attachment'
import constants from 'Config/constants'

class DogRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Dog, relations)
        this.model = Dog
    }

    async index(orderByColumn = constants.ORDER_BY_COLUMN, orderByValue = constants.ORDER_BY_VALUE, page = 1, perPage = constants.PER_PAGE,ctx) {
        let query = this.model.query().withScopes((scope) => scope.dogRelations())

        if(ctx.request.input('keyword')){
            query.where((dogQuery) =>{
                dogQuery.where('name','like',`%${ctx.request.input('keyword')}%`)
                    .orWhere('description','like',`%${ctx.request.input('keyword')}%`)
            })
        }
        if(ctx.request.input('size_id')){
            query.where('size_id',ctx.request.input('size_id'))
        }
        if(ctx.request.input('breed_id')){
            query.where('breed_id',ctx.request.input('breed_id'))
        }
        if(ctx.request.input('gender_id')){
            query.where('gender_id',ctx.request.input('gender_id'))
        }

        return query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    }

    async store(input, request: RequestContract) {
        let row = await this.model.create(input)
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

    async myDogs(userId){
        return this.model.query()
            .withScopes((scope) => scope.dogRelations())
            .where({userId})
    }
}

export default new DogRepo()