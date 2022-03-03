import BaseRepo from 'App/Repos/BaseRepo'
import BadgeCriterion from "App/Models/BadgeCriterion";
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'

class BadgeCriterionRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(BadgeCriterion, relations)
        this.model = BadgeCriterion
    }

    async restrictIfExist(input,excludeId = null){
        let query = this.model.query().select('id').where({
            roleId:input.role_id,
            badgeId:input.badge_id,
        })

        if(input.posts_count && input.likes_count){
            query.where('posts_count',input.posts_count).where('likes_count',input.likes_count).where('reaction_type',input.reaction_type)
        }else if(input.posts_count){
            query.where('posts_count',input.posts_count)
        }else if(input.likes_count){
            query.where('likes_count',input.likes_count).where('reaction_type',input.reaction_type)
        }

        if(excludeId){
            query = query.where('id','!=',excludeId)
        }
        let postCriteria = await query.first()
        if(postCriteria){
            throw new ExceptionWithCode('A similar badge criteria for this role already exists.',200)
        }
    }

    async store(input){
        await this.restrictIfExist(input)
        return this.model.create(input)
    }

    async update(id,input){
        await this.restrictIfExist(input,id)
        return super.update(id,input)
    }
}

export default new BadgeCriterionRepo()