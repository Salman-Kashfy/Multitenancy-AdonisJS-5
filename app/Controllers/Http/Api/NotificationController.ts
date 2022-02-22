import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import NotificationRepo from "App/Repos/NotificationRepo";


export default class NotificationController extends ApiBaseController {

    constructor() {
        super(NotificationRepo)
    }

}
