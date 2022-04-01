import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import SettingRepo from "App/Repos/SettingRepo";
import SettingValidator from "App/Validators/SettingValidator";
import Attachment from "App/Models/Attachment";

export default class SettingController extends ApiBaseController {

    constructor() {
        super(SettingRepo)
    }

    async index() {
        let settings = await SettingRepo.model.query().first()
        return this.apiResponse('Settings retrieved successfully', settings);
    }

    async store(ctx: HttpContextContract, instanceType?: number, mediaType?: String) {
        await ctx.request.validate(SettingValidator)
        let input = ctx.request.only(this.repo.fillables())
        let row = await SettingRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()], mediaType)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract) {
        await ctx.request.validate(SettingValidator)
        let input = ctx.request.only(this.repo.fillables())
        const row = await this.repo.update(input)
        return this.apiResponse('Record Updated Successfully', row)
    }

}
