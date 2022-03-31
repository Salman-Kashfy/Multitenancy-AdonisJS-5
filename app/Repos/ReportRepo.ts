import BaseRepo from 'App/Repos/BaseRepo'
import Report from 'App/Models/Report'
import Post from 'App/Models/Post'
import User from 'App/Models/User'
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import constants from "Config/constants";
import myHelpers from 'App/Helpers'

class ReportRepo extends BaseRepo {
    model

    constructor() {
        const relations = ['user']
        super(Report, relations)
        this.model = Report
    }

    async index(
        orderByColumn = constants.ORDER_BY_COLUMN,
        orderByValue = constants.ORDER_BY_VALUE,
        page = 1,
        perPage = constants.PER_PAGE,
        // @ts-ignore
        ctx: HttpContextContract
    ) {
        let countQuery
        let query = this.model.query().orderBy(orderByColumn, orderByValue)
        for (let relation of this.relations) await query.preload(relation)

        if(ctx.request.input('keyword')){
            query.whereHas('user',(userQuery) =>{
                userQuery.where('name','like',`%${ctx.request.input('keyword')}%`)
            })
        }
        countQuery = query
        const total = await countQuery
        let offset = (page-1)*perPage
        let reports = await query
            .groupBy(['instance_id','instance_type'])
            .orderBy(orderByColumn, orderByValue).offset(offset).limit(perPage)
        return myHelpers.formatPages(reports,total.length,page,perPage)
    }

    async contentReport(
        orderByColumn = constants.ORDER_BY_COLUMN,
        orderByValue = constants.ORDER_BY_VALUE,
        page = 1,
        perPage = constants.PER_PAGE,
        // @ts-ignore
        ctx: HttpContextContract
    ){
        let query = this.model.query()
        for (let relation of this.relations) await query.preload(relation)
        return await query
            .where('instance_id', ctx.request.input('instance_id'))
            .where('instance_type', ctx.request.input('instance_type'))
            .orderBy(orderByColumn, orderByValue)
            .paginate(page, perPage)
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

    getModelInstance(instanceType){
        switch (instanceType) {
            case this.model.INSTANCE_TYPES.USER:
                return User
            case this.model.INSTANCE_TYPES.POST:
                return Post
            default:
                return false
        }
    }

    async restrictIfExist(input) {
        const model = this.getModelInstance(parseInt(input.instance_type))
        if(model){
            const record = await this.model.query().where('user_id',input.user_id).where('instance_id', input.instance_id).where('instance_type', input.instance_type).getCount('id as count').first()
            if(record.$extras.count){
                throw new ExceptionWithCode('You have already reported this content.',200)
            }else{
                return
            }
        }
        throw new ExceptionWithCode('Record not found',404)
    }

    async store(input) {
        await this.validateInstance(input)
        await this.restrictIfExist(input)
        return this.model.create(input)
    }

    async updateContentReport(id,input){
        const report = await this.model.find(id)
        return this.model.query()
            .where('instance_id', report.instanceId)
            .where('instance_type', report.instanceType)
            .update(input)
    }
}

export default new ReportRepo()