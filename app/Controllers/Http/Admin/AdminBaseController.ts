// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from 'App/Controllers/Http/BaseController'

export default class AdminBaseController extends BaseController {
    async index() {
        console.log(`From Admin Controller`)
    }

}
