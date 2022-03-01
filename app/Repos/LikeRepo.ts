import BaseRepo from 'App/Repos/BaseRepo'
import Like from "App/Models/Like";
import {LikeInterface} from "App/Interfaces/LikeInterface";
import Database from "@ioc:Adonis/Lucid/Database"
import Pluralize from 'pluralize';
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import constants from 'Config/constants'

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
        for (let relation of this.relations) await query.preload(relation)
        return await query.paginate(page, perPage)
    }

    async unlike(input:LikeInterface){
        return this.model.query().where(input).delete()
    }

    async store(input) {
        const data = {
            userId: input.user_id,
            instanceType: input.instance_type,
            instanceId: input.instance_id,
        }
        return await this.model.updateOrCreate(data, input)
    }

    async validateInstance(input){
        const key = Object.keys(this.model.TYPE)[Object.values(this.model.TYPE).indexOf(input.instance_type)];
        const record:any = await Database.query().from(Pluralize(key).toLowerCase()).select('id').where('id', input.instance_id).limit(1).first()
        if(!record){
            throw new ExceptionWithCode('Record not found',404)
        }
    }
}

export default new LikeRepo()