// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseRepo from 'App/Repos/BaseRepo'
import User from 'App/Models/User';
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
            if (user.verified) {
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
}

export default new AuthRepo()
