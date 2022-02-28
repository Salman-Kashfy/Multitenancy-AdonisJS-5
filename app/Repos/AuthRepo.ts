import BaseRepo from 'App/Repos/BaseRepo'
import User from 'App/Models/User';
import Subscription from 'App/Models/Subscription'
import UserDevice from 'App/Models/UserDevice'

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

    async createParent(input){
        const user = await this.model.create(input);
        await user.related('subscription').sync([Subscription.FREE_PLAN])
        return user
    }

    async createBusiness(input,businessDetails,request){
        input.name = businessDetails.business_name
        const user = await this.model.create(input);
        if(!user) return false
        await user.related('subscription').sync([Subscription.FREE_PLAN])
        const business = await user.related('business').create(businessDetails)
        await business.related('categories').sync([request.input('category_id')])
        return user
    }

    async login(input,user,auth){
        const token = await auth.use('api').attempt(input.email, input.password)
        const role = await user.related('roles').query().first()
        return { status:true, message: 'Logged in successfully !',data:{user,token,role} }
    }

    async logout(input,auth){
        await auth.use('api').revoke()
        if(input.device_token && input.device_type){
            await UserDevice.query()
                .where('device_token',input.device_token)
                .where('device_type',input.device_type)
                .delete()
        }
    }
}

export default new AuthRepo()
