import BaseRepo from 'App/Repos/BaseRepo'
import Report from 'App/Models/Report'
import Post from 'App/Models/Post'
import User from 'App/Models/User'
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'

class ReportRepo extends BaseRepo {
    model

    constructor() {
        const relations = ['user']
        super(Report, relations)
        this.model = Report
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
            const record = await this.model.query().where('instance_id', input.instance_id).where('instance_type', input.instance_type).getCount('id as count').first()
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