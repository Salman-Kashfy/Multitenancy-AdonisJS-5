import BaseRepo from 'App/Repos/BaseRepo'
import Attachment from 'App/Models/Attachment';
import Pluralize from 'pluralize';
import Database from '@ioc:Adonis/Lucid/Database'
import AttachmentInstance from 'App/Interfaces/AttachmentInstance'

class AttachmentRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Attachment, relations)
        this.model = Attachment
    }

    async checkAllBelonging(attachmentId,userId:number,matchColumn:string = 'user_id'){
        if(typeof attachmentId === "number"){
            attachmentId = [attachmentId]
        }
        const attachments = await this.model.query().select('instance_id','instance_type').whereIn('id',attachmentId)
        let flag = true
        if(attachments.length){
            for (let i = 0; i < attachments.length; i++) {
                const key = Object.keys(Attachment.TYPE)[Object.values(Attachment.TYPE).indexOf(attachments[i].instanceType)];
                const row:any = await Database.query().from(Pluralize(key).toLowerCase()).select(matchColumn).where('id', attachments[i].instanceId).limit(1).first()
                if(row[matchColumn] !== userId){
                    flag = false
                    break
                }
            }
        }
        return flag
    }

    async removeAttachments(attachment:AttachmentInstance){
        await this.model.query().where(attachment).update({'deleted_at': new Date()})
    }
}

export default new AttachmentRepo()
