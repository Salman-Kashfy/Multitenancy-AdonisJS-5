import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ParkBlockedUserRepo from "App/Repos/ParkBlockedUserRepo";

export default class ParkBlockedUserController extends ApiBaseController {

    constructor() {
        super(ParkBlockedUserRepo)
    }

    async index(ctx:HttpContextContract){
        const row = await this.repo.index(ctx);
        return this.apiResponse('Record Added Successfully', row)
    }

}
