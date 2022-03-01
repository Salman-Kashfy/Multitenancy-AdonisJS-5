import BaseRepo from 'App/Repos/BaseRepo'
import PostCriterion from "App/Models/PostCriterion";


class PostCriterionRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(PostCriterion, relations)
        this.model = PostCriterion
    }
}

export default new PostCriterionRepo()