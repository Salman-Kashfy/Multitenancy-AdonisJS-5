import BaseRepo from 'App/Repos/BaseRepo'
import User from "App/Models/User";
import Database from '@ioc:Adonis/Lucid/Database'
import AppInvitation from "App/Mailers/AppInvitation";
import constants from 'Config/constants'
import Friend from 'App/Models/Friend'
import Role from 'App/Models/Role'
import SendAlerts from 'App/Interfaces/SendAlerts'
import myHelpers from 'App/Helpers'

class UserRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(User, relations)
        this.model = User
    }

    async profile(user){
        if(typeof user !== "object"){
            user = await this.model.find(user)
        }
        const userRoles = await user.related('roles').query()
        const userRoleIds = userRoles.map(function(role) {
            return role.id;
        });
        if(userRoleIds.includes(Role.BUSINESS)){
            let business = await user.related('business').query()
                .preload('categories')
                .preload('attachments')
                .first()
            user = user.toJSON()
            user.business = business || null
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
        let result = { status:true,message:'' }
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

    async suggestedFriends(orderByColumn = constants.ORDER_BY_COLUMN, orderByValue = constants.ORDER_BY_VALUE, page = 1, perPage = constants.PER_PAGE,ctx){

        let query = this.model.query()
            .whereNotIn('id',[...Object.values(this.model.PREDEFINED_USERS),ctx.auth.user.id])
            .whereNotExists((builder) =>{
                builder.select('id').from(Friend.table)
                    .whereRaw(`${Friend.table}.user_id = ${ctx.auth.user.id} AND ${this.model.table}.id = ${Friend.table}.friend_id`)
            })

        if(ctx.request.input('keyword')){
            query.where('name','like',`%${ctx.request.input('keyword')}%`)
        }
        return query.orderBy(orderByColumn, orderByValue).paginate(page, perPage)
    }

    async sendAlerts(input:SendAlerts){
        if(!input.latitude || !input.longitude) return
        let users = await this.model.query()
            .whereNotNull('latitude')
            .whereNotNull('longitude')
            .select('*',Database.raw(this.model.distanceQuery,[constants.PARK_DISTANCE_LIMIT,input.latitude,input.longitude,input.latitude]))
            .having('distance','<=',constants.PARK_RADIUS)
        users = users.map((user) =>{
            myHelpers.sendNotificationStructure('','','','','')
            return user.id
        })
        console.log(users)
    }
}

export default new UserRepo()
