import BaseRepo from 'App/Repos/BaseRepo'
import User from 'App/Models/User';
import UserDevice from 'App/Models/UserDevice'
import Subscription from 'App/Models/Subscription'
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'

class AuthRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(User, relations)
        this.model = User
    }

    async beforeSignup(user){
        let status = true,message = ""
        if(user){
            if (user.emailVerified) {
                status = false
                message = 'Email already exist.'
            }else{
                await user.forceDelete()
            }
        }
        return {status,message}
    }

    async beforeLogin(user,allowedRoles:number[]){
        if(user.is_blocked){
            throw new ExceptionWithCode('You have been blocked! Contact support for further information.',403)
        }
        const roles = await user.related('roles').query()
        for (const role of roles) {
            if(!allowedRoles.includes(role.id)){
                throw new ExceptionWithCode('Invalid role.',403)
            }
        }
    }

    async createParent(input){
        const user = await this.model.create(input);
        await user.related('subscription').sync({
            [Subscription.FREE_PLAN]:{
                platform:'local'
            }
        })
        return user
    }

    async createBusiness(input,businessDetails,request){
        input.name = businessDetails.business_name
        const user = await this.model.create(input);
        if(!user) return false
        await user.related('subscription').sync({
            [Subscription.FREE_PLAN]:{
                platform:'local'
            }
        })
        const business = await user.related('business').create(businessDetails)
        await business.related('categories').sync(request.input('category'))
        return user
    }

    async login(input,auth){
        return await auth.use('api').attempt(input.email, input.password)
    }

    async logout(input,auth){
        await auth.use('api').revoke()
        await UserDevice.query()
            .where('device_token',input.device_token)
            .where('device_type',input.device_type)
            .delete()
    }
}

export default new AuthRepo()
