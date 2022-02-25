import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BlockedUserRepo from "App/Repos/BlockedUserRepo";
import BlockedUserValidator from "App/Validators/BlockedUserValidator";
import constants from 'Config/constants'

export default class BlockedUserController extends ApiBaseController {

    constructor() {
        super(BlockedUserRepo)
    }

    async blockedUsers(ctx: HttpContextContract) {
        let page = ctx.request.input('page', 1)
        let perPage = ctx.request.input('per-page', constants.PER_PAGE)
        let rows = await BlockedUserRepo.blockedUsers(page, perPage, ctx)
        return this.apiResponse('Posts fetched successfully', rows)
    }

    async blockOrUnblock({request,auth}: HttpContextContract) {
        await request.validate(BlockedUserValidator)
        const {user} = auth
        let input = request.only(this.repo.model.fillables())
        const blockedDetails = {...input,user_id:user?.id}
        if (request.input('unblock') == 1) {
            await BlockedUserRepo.model.query().where(blockedDetails).delete()
            return this.apiResponse('UnBlocked Successfully', true)
        }
        let row = await BlockedUserRepo.blockOrUnblock(blockedDetails)
        return this.apiResponse('Blocked Successfully', row)
    }

}
