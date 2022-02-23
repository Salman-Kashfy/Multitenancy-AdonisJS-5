import BaseRepo from 'App/Repos/BaseRepo'
import User from 'App/Models/User';
import GlobalResponseInterface from 'App/Interfaces/GlobalResponseInterface';
import Subscription from 'App/Models/Subscription'

class AuthRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(User, relations)
        this.model = User
    }

    async beforeSignup(user){
        let response:GlobalResponseInterface = {
            status:true
        }
        if(user){
            if (user.emailVerified) {
                response = { status:false, message: 'Email already exist.' }
            }else{
                await user.forceDelete()
            }
        }
        return response
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
        let response:GlobalResponseInterface
        try {
            const token = await auth.use('api').attempt(input.email, input.password)
            const role = await user.related('roles').query().first()
            response = { status:true, message: 'Logged in successfully !',data:{user,token,role} }
        } catch {
            return { status:false, message: 'Invalid email or password.' }
        }

        return response
    }
}

export default new AuthRepo()
