import BaseRepo from 'App/Repos/BaseRepo'
import PostCriterion from "App/Models/PostCriterion";
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'

class PostCriterionRepo extends BaseRepo {
    model

    constructor() {
        const relations = ['role','subscription']
        super(PostCriterion, relations)
        this.model = PostCriterion
    }

    async restrictIfExist(subscriptionId,roleId,excludeId = null){
        let query = this.model.query().select('id').where('role_id',roleId).where('subscription_id',subscriptionId)
        if(excludeId){
            query = query.where('id','!=',excludeId)
        }
        let postCriteria = await query.first()
        if(postCriteria){
            throw new ExceptionWithCode('A criteria for this role and subscription already exists.',200)
        }
    }

    async store(input) {
        await this.restrictIfExist(input.subscription_id,input.role_id)
        return await this.model.create(input)
    }

    async update(id,input) {
        await this.restrictIfExist(input.subscription_id,input.role_id,id)
        await super.update(id,input)
    }
}


export default new PostCriterionRepo()