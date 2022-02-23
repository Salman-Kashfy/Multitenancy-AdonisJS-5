import BaseRepo from 'App/Repos/BaseRepo'
import User from "App/Models/User";
import Attachment from "App/Models/Attachment";
import Database from '@ioc:Adonis/Lucid/Database'
import GlobalResponseInterface from 'App/Interfaces/GlobalResponseInterface'
import AppInvitation from "App/Mailers/AppInvitation";

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
        if(business){
            business = business.toJSON()
            const attachment = await Attachment.query().where('instance_id', business.id).where('instance_type', Attachment.TYPE.BUSINESS).first()
            business.attachment = attachment
            user = {...user.toJSON(),business}
        }
        return user
    }

    async getUsersByPhone(input){
        let phoneArray = [],emailArray = []
        if (input.some(contact => contact.phone)) {
            phoneArray = input.map(contact => contact.phone);
        }
        if (input.some(contact => contact.email)) {
            emailArray = input.map(contact => contact.email);
        }

        const query = this.model.query().select('id','name','username','email','phone')
            .withCount('friends',(friendQuery) =>{
                friendQuery.as('is_friend')
            })

        if(phoneArray.length && emailArray.length){
            query.whereIn('phone',phoneArray).orWhereIn('email', emailArray)
        }else if(phoneArray.length){
            query.whereIn('phone',phoneArray)
        }else if(emailArray.length){
            query.whereIn('email',emailArray)
        }

        let result = await query
        let outsideApp:any = []

        const systemPhoneContacts = result.map(contact => contact.phone);
        const systemEmailContacts = result.map(contact => contact.email);

        for (let i = 0; i < input.length; i++) {
            if(
                (input[i].phone && !systemPhoneContacts.includes(input[i].phone))
                ||
                (input[i].email && !systemEmailContacts.includes(input[i].email))
            ){
                outsideApp.push(input[i])
            }
        }

        return {in_app:result, outside_app:outsideApp}
    }

    async invite(input,user){
        let result:GlobalResponseInterface = {
            status:true
        }
        if(input.email){
            const row = await this.model.query().select(Database.raw('COUNT(id) as count')).where('email',input.email).first()
            if(row.count){
                result = {status:false,message:"Record already exist"}
            }else{
                /* Send Email */
                const subject:string = 'You have received an invitation.'
                await new AppInvitation(user, input.email, subject).sendLater()
            }
        }
        return result
    }
}

export default new UserRepo()
