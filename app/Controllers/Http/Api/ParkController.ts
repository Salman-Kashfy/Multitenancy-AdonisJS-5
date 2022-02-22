import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ParkRepo from "App/Repos/ParkRepo";
import AddParkValidator from "App/Validators/AddParkValidator";
import EditParkValidator from "App/Validators/EditParkValidator";
import AttachmentRepo from 'App/Repos/AttachmentRepo'

export default class ParkController extends ApiBaseController {

    constructor() {
        super(ParkRepo)
    }

    async store({ request,auth }: HttpContextContract) {
        const { user }:any = auth
        await request.validate(AddParkValidator)
        let input = request.only(this.repo.model.fillables())
        input.user_id = user.id
        let row = await ParkRepo.store(input, request)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract): Promise<{ data: any; message: string; status: boolean }> {
        const {user}:any = ctx.auth
        await ctx.request.validate(EditParkValidator)
        if(! await this.repo.belonging(ctx)){
            return this.globalResponse(ctx.response,false,'Record not found!',null,404)
        }
        if(ctx.request.input('remove_media') && !await AttachmentRepo.checkAllBelonging(ctx.request.input('remove_media'),user.id)){
            return this.globalResponse(ctx.response,false,'Invalid attachment!',null,403)
        }
        const input = ctx.request.only(this.repo.model.fillables())
        const row = await this.repo.update(ctx.request.param('id'),input, ctx.request)
        return this.apiResponse('Record Updated Successfully', row)
    }

    async destroy(ctx:HttpContextContract){
        if(! await this.repo.belonging(ctx)){
            return this.globalResponse(ctx.response,false,'Record not found!',null,404)
        }
        await AttachmentRepo.removeAttachments({instanceId:ctx.request.param('id'),instanceType:AttachmentRepo.model.TYPE.PARK})
        await this.repo.delete(ctx.request.param('id'))
        return this.apiResponse('Record Deleted Successfully')
    }

    async myParks({auth}:HttpContextContract){
        const {user}:any = auth
        const row = await this.repo.myParks(user.id)
        return this.apiResponse('Record Fetched Successfully',row)
    }

    async join({ request,auth }: HttpContextContract){

    }

}
