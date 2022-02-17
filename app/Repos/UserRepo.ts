import BaseRepo from 'App/Repos/BaseRepo'
import User from "App/Models/User";
import Attachment from "App/Models/Attachment";

class UserRepo extends BaseRepo {
    model

    constructor() {
        const relations = ['attachments']
        super(User, relations)
        this.model = User
    }

    async profile(user){
        if(typeof user !== "object"){
            user = await this.model.find(user)
        }
        let business = await user.related('business').query().first()
        business = business.toJSON()
        if(business){
            const attachment = await Attachment.query().where('instance_id', business.id).where('instance_type', Attachment.TYPE.BUSINESS).first()
            business.attachment = attachment
            user = {...user.toJSON(),business}
        }
        return user
    }
}

export default new UserRepo()
