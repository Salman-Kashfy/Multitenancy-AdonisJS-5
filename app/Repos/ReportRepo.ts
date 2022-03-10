import BaseRepo from 'App/Repos/BaseRepo'
import Report from 'App/Models/Report'
import Post from 'App/Models/Post'
import User from 'App/Models/User'
import Pluralize from 'pluralize'
import Database from '@ioc:Adonis/Lucid/Database'
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'

class ReportRepo extends BaseRepo {
    model

    constructor() {
        const relations = ['user']
        super(Report, relations)
        this.model = Report
    }

    async instanceBelonging(instanceId,instanceType) {
        const key = Object.keys(this.model.INSTANCE_TYPES)[Object.values(this.model.INSTANCE_TYPES).indexOf(parseInt(instanceType))]
        const record: any = await Database.query().from(Pluralize(key).toLowerCase()).select('id').where('id', instanceId).limit(1).first()
        if(!record)
        throw new ExceptionWithCode('Record not found',404)
    }

    async restrictIfExist(instanceId,instanceType,userId) {
        const key = Object.keys(this.model.INSTANCE_TYPES)[Object.values(this.model.INSTANCE_TYPES).indexOf(parseInt(instanceType))].toLowerCase()
        const record: any = await this.model.query().select('id').where('user_id', userId).where('instance_id', instanceId).where('instance_type', instanceType).limit(1).first()
        if(record)
        throw new ExceptionWithCode(`You have already reported this ${key}.`,200)
    }

    async store(input) {
        await this.instanceBelonging(input.instance_id,input.instance_type)
        await this.restrictIfExist(input.instance_id,input.instance_type,input.user_id)
        return this.model.create(input)
    }

    async show(id) {
        let content
        let row = await this.model.findOrFail(id)
        for (let relation of this.relations) await row.load(relation)
        switch (row.instanceType) {
            case this.model.INSTANCE_TYPES.POST:
                content = await Post.query().where('id', row.instanceId).preload('user').first()
                break
            case this.model.INSTANCE_TYPES.USER:
                content = await User.query().where('id', row.instanceId).first()
                break
            default:
                break
        }
        return { ...row.toJSON(), content }
    }
}

export default new ReportRepo()