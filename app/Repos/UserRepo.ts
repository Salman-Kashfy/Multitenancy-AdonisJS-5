import BaseRepo from 'App/Repos/BaseRepo'
import User from "App/Models/User";
//import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"

class UserRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(User, relations)
        this.model = User
    }
}

export default new UserRepo()
