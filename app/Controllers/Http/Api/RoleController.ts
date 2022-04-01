import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import RoleRepo from "App/Repos/RoleRepo";

export default class RoleController extends ApiBaseController {

    constructor() {
        super(RoleRepo)
    }

}
