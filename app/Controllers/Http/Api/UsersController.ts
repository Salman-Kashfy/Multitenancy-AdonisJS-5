import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import UserRepo from 'App/Repos/UserRepo'

export default class UsersController extends ApiBaseController{

    constructor() {
        super(UserRepo)
    }

    async test( { request }: HttpContextContract ){

        return this.apiResponse("Response Retrieved Successfully!",request.headers().host)
    }

}
