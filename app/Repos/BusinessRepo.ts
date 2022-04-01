import BaseRepo from 'App/Repos/BaseRepo'
import Business from "App/Models/Business";
import Attachment from 'App/Models/Attachment'

class BusinessRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Business, relations)
        this.model = Business
    }

    async update(user,input,request){
        let business = await this.model.query().where('user_id',user.id).first()
        if(!business){
            business = await this.model.create({...input,user_id:user.id})
        }else{
            await user.related('business').query().update(input)
        }
        if(request.input('category')){
            await business.related('categories').sync(request.input('category'))
        }
        const attachment = {
            instanceId: business.id,
            instanceType: Attachment.TYPE.BUSINESS
        }
        if(request.input('remove_image') || request.input('image')){
            await Attachment.query().where(attachment).update({'deleted_at': new Date()})
        }
        if(request.input('image')){
            await business.related('attachments').create({
                path:request.input('image'),
                mimeType: 'image',
                ...attachment
            })
        }
    }
}

export default new BusinessRepo()