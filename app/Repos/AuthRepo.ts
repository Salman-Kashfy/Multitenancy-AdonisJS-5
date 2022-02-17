import BaseRepo from 'App/Repos/BaseRepo'
import User from 'App/Models/User';
import Role from 'App/Models/Role';
import GlobalResponseInterface from 'App/Interfaces/GlobalResponseInterface';

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
        return this.model.create(input);
    }

    async createBusiness(input,businessDetails,request){
        const user = await this.model.create(input);
        if(!user) return false
        const business = await user.related('business').create(businessDetails)
        await business.related('categories').sync([request.input('category_id')])
        return user
    }

    async login(input,user,auth){
        let response:GlobalResponseInterface
        try {
            const token = await auth.use('api').attempt(input.email, input.password)
            const role = await user.related('roles').query().select(...Role.select()).first()
            response = { status:true, message: 'Logged in successfully !',data:{user,token,role} }
        } catch {
            return { status:false, message: 'Invalid email or password.' }
        }

        /*
        * If credentials are valid
        * */
        if(!user.emailVerified){
            await auth.use('api').revoke()
            response = { status:false, message: 'Please verify your email address.' }
        }

        return response
    }
}

export default new AuthRepo()
