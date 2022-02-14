// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseRepo from 'App/Repos/BaseRepo'

import {RequestContract} from "@ioc:Adonis/Core/Request";
import SocialAccount from "App/Models/SocialAccount";

class SocialAccountRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(SocialAccount, relations)
        this.model = SocialAccount
    }

    // @ts-ignore
    async store(request: RequestContract, userId: number) {
        const input = request.only(['platform', 'client_id', 'expired_at'])
        return await this.model.updateOrCreate(
            {user_id: userId, platform: input.platform, client_id: input.client_id},
            input
        )
    }

    async findSocialLogin(request) {
        return await this.model.query().where({
            platform: request.input('platform'),
            client_id: request.input('client_id'),
        }).first();
    }
}

/*Create a singleton instance*/
export default new SocialAccountRepo()
