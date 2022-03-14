import BaseRepo from 'App/Repos/BaseRepo'
import User from "App/Models/User";
import Database from '@ioc:Adonis/Lucid/Database'
import AppInvitation from "App/Mailers/AppInvitation";
import constants from 'Config/constants'
import Friend from 'App/Models/Friend'
import Role from 'App/Models/Role'
import Dog from 'App/Models/Dog'
import SharedPost from 'App/Models/SharedPost'
import Post from 'App/Models/Post'
import { DateTime } from 'luxon'
import Like from 'App/Models/Like'

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
        const badges = await user.related('badges').query()
        if(userRoleIds.includes(Role.BUSINESS)){
            const business = await user.related('business').query()
                .preload('categories')
                .preload('attachments')
                .first()
            user = {...user.toJSON(),business}
        }else{
            user = user.toJSON()
        }

        return {...user,badges}
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

    async statistics(userId){

        /*
        * Profile Health
        * */
        const dogExist = await Dog.query().select('id').where('user_id',userId).first()
        const friendExist = await Friend.query().select('id').where('user_id',userId).where('status',Friend.STATUSES.ACCEPTED).first()
        const shareExist = await SharedPost.query().select('id').where('user_id',userId).first()

        /*
        * Interactions
        * */
        const startDate = DateTime.local().startOf('month').toFormat('yyyy-MM-dd HH:mm:ss')
        const endDate = DateTime.local().endOf('month').toFormat('yyyy-MM-dd HH:mm:ss')
        let posts = await Post.query().select('id')
            .where('user_id', userId)
            .whereBetween('created_at', [startDate, endDate])
            .withScopes((scope) => scope.postLikeReactionsCount())

        let obj = {};
        Object.values(Like.REACTION).forEach((value) =>{
            obj[`${value}`] = 0
        })
        if(posts.length>0){
            let likeCount = posts.map((post) =>{
                return post.$extras
            })
            for (let i = 0; i < likeCount.length; i++) {
                if(!i){
                    obj = likeCount[i]
                    continue
                }
                for (const [key, value] of Object.entries(likeCount[i])) {
                    obj[key] = obj[key]+value
                }
            }
        }

        /*
        * Post Shares
        * */
        let shareCount = 0
        let postsShares = await Post.query().select('id')
            .where('user_id', userId)
            .whereBetween('created_at', [startDate, endDate])
            .withCount('sharedPosts',(sharePostQuery) =>{ sharePostQuery.as('shareCount') })

        postsShares.map((postsShare) =>{
            shareCount+=postsShare.$extras.shareCount
        })

        /*
        * Comment Shares
        * */
        let commentsCount = 0
        let postComments = await Post.query().select('id')
            .where('user_id', userId)
            .whereBetween('created_at', [startDate, endDate])
            .withCount('comments',(commentQuery) =>{ commentQuery.as('commentsCount') })

        postComments.map((postComment) =>{
            commentsCount+=postComment.$extras.commentsCount
        })

        return {
            profile_health:{
                dog_exist: !!dogExist,
                friend_exist: !!friendExist,
                share_exist: !!shareExist,
            },
            interactions:{ ...obj },
            shares:shareCount,
            comments:commentsCount
        }
    }
}

export default new UserRepo()
