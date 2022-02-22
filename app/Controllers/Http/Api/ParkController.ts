import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ParkRepo from "App/Repos/ParkRepo";
import AddParkValidator from "App/Validators/AddParkValidator";
import EditParkValidator from "App/Validators/EditParkValidator";
import JoinParkValidator from "App/Validators/JoinParkValidator";
import AcceptDeclineParkRequestValidator from "App/Validators/AcceptDeclineParkRequestValidator";
import AttachmentRepo from 'App/Repos/AttachmentRepo'
import ParkMemberRepo from 'App/Repos/ParkMemberRepo'
import ParkRequestRepo from 'App/Repos/ParkRequestRepo'

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

    async hostParks({auth}:HttpContextContract){
        const {user}:any = auth
        const row = await this.repo.hostParks(user.id)
        return this.apiResponse('Record Fetched Successfully',row)
    }

    async myParks({auth}:HttpContextContract){
        const {user}:any = auth
        const row = await this.repo.myParks(user.id)
        return this.apiResponse('Record Fetched Successfully',row)
    }

    async join({ request,response,auth }: HttpContextContract){
        const {user}:any = auth
        const input = await request.validate(JoinParkValidator)
        const park = await this.repo.find(input.park_id)

        /*
        * Check if user is already a park member
        * */
        const member = await ParkMemberRepo.model.query().where({parkId:park.id,memberId:user.id}).first()
        if(member){
            return this.globalResponse(response,false,"Already a member!")
        }

        /*
        * Check if user has a request already pending
        * */
        const parkRequest = await ParkRequestRepo.model.query().where({parkId:park.id,memberId:user.id}).first()
        if(parkRequest){
            return this.globalResponse(response,false,"Request already sent!")
        }
        const result = await this.repo.join(park,user.id)
        return this.globalResponse(response,result.status,result.message)
    }

    async acceptDeclineRequest({request,response,auth}: HttpContextContract){
        const {user}:any = auth
        const input = await request.validate(AcceptDeclineParkRequestValidator)

        /*
        * Check park belonging
        * */
        const park = await this.repo.find(input.park_id)
        if(park.userId !== user.id){
            return this.globalResponse(response,false,'Permission denied!',null,403)
        }

        /*
        * Check if request exist
        * */
        const parkRequest = await ParkRequestRepo.model.query().where({parkId:park.id,memberId:input.member_id}).first()
        if(!parkRequest){
            return this.globalResponse(response,false,"Request not found",null,404)
        }

        /*
        * Accept/Decline join request
        * */
        const result = await this.repo.acceptDeclineRequest(parkRequest,input.accept)
        return this.globalResponse(response,result.status,result.message)
    }

}
