import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ParkMemberRepo from "App/Repos/ParkMemberRepo";

export default class ParkMemberController extends ApiBaseController {

    constructor() {
        super(ParkMemberRepo)
    }

    async index(ctx:HttpContextContract){
        const row = await this.repo.index(ctx);
        return this.apiResponse('Record Added Successfully', row)
    }

}
