import BaseRepo from 'App/Repos/BaseRepo'
import PostCriterion from "App/Models/PostCriterion";
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'

class PostCriterionRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(PostCriterion, relations)
        this.model = PostCriterion
    }

    async restrictIfExist(subscriptionId,roleId,excludeId){
        let query = this.model.query().select('id').where('role_id',roleId).where('subscription_id',subscriptionId)
        if(excludeId){
            query = query.where('id','!=',excludeId)
        }
        let postCriteria = await query.first()
        if(postCriteria){
            throw new ExceptionWithCode('A criteria for this role and subscription already exists.',200)
        }
    }
}


export default new PostCriterionRepo()