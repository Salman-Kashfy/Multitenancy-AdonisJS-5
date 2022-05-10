import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ParkRepo from "App/Repos/ParkRepo";
import AddParkValidator from "App/Validators/AddParkValidator";
import EditParkValidator from "App/Validators/EditParkValidator";
import JoinParkValidator from "App/Validators/JoinParkValidator";
import BlockParkMemberValidator from "App/Validators/BlockParkMemberValidator";
import AcceptDeclineParkRequestValidator from "App/Validators/AcceptDeclineParkRequestValidator";
import AttachmentRepo from 'App/Repos/AttachmentRepo'
import ParkMemberRepo from 'App/Repos/ParkMemberRepo'
import ParkRequestRepo from 'App/Repos/ParkRequestRepo'
import constants from 'Config/constants'
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import ParkExistValidator from 'App/Validators/ParkExistValidator'
import Role from 'App/Models/Role'

export default class ParkController extends ApiBaseController {

    constructor() {
        super(ParkRepo)
    }

    async store({ request,auth }: HttpContextContract) {
        const { user } = auth
        await request.validate(AddParkValidator)
        let input = request.only(this.repo.model.fillables())
        input.user_id = user?.id
        let row = await ParkRepo.store(input, request)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract): Promise<{ data: any; message: string; status: boolean }> {
        const {user} = ctx.auth
        await ctx.request.validate(EditParkValidator)
        const belonging = await this.repo.belonging(ctx.request.param('id'),user?.id)
        if(!belonging){
            throw new ExceptionWithCode('Record not found!',404)
        }
        if(ctx.request.input('remove_media') && !await AttachmentRepo.checkAllBelonging(ctx.request.input('remove_media'),user?.id)){
            throw new ExceptionWithCode('Invalid attachment!',403)
        }
        const input = ctx.request.only(this.repo.model.fillables())
        const row = await this.repo.update(ctx.request.param('id'),input, ctx.request)
        return this.apiResponse('Record Updated Successfully', row)
    }

    async destroy(ctx:HttpContextContract){
        const {user} = ctx.auth
        const role = await ctx.auth.user?.related('roles').query().where('role_id',Role.ADMIN).first()
        const belonging = await this.repo.belonging(ctx.request.param('id'),user?.id)
        if(!role && !belonging){
            throw new ExceptionWithCode('Record not found!',404)
        }
        await AttachmentRepo.removeAttachments({instanceId:ctx.request.param('id'),instanceType:AttachmentRepo.model.TYPE.PARK})
        await this.repo.delete(ctx.request.param('id'))
        return this.apiResponse('Record Deleted Successfully')
    }

    async hostParks(ctx:HttpContextContract){
        let page = ctx.request.input('page', 1)
        let perPage = ctx.request.input('per-page', constants.PER_PAGE)
        let orderByColumn = ctx.request.input('order-column', constants.ORDER_BY_COLUMN)
        let orderByValue = ctx.request.input('order', constants.ORDER_BY_VALUE)
        let rows = await this.repo.hostParks(orderByColumn, orderByValue, page, perPage, ctx.auth.user?.id)
        return this.apiResponse('Records fetched successfully', rows)
    }

    async myParks(ctx:HttpContextContract){
        let page = ctx.request.input('page', 1)
        let perPage = ctx.request.input('per-page', constants.PER_PAGE)
        let orderByColumn = ctx.request.input('order-column', constants.ORDER_BY_COLUMN)
        let orderByValue = ctx.request.input('order', constants.ORDER_BY_VALUE)
        let input = ctx.request.only(['keyword'])
        let rows = await this.repo.myParks(orderByColumn, orderByValue, page, perPage, {...input,userId:ctx.auth.user?.id})
        return this.apiResponse('Records fetched successfully', rows)
    }

    async join({ request,auth }: HttpContextContract){
        const {user} = auth
        const input = await request.validate(JoinParkValidator)
        const park = await this.repo.find(input.park_id)

        /*
        * Check if user is already a park member
        * */
        const member = await ParkMemberRepo.model.query().where({parkId:park.id,memberId:user?.id}).first()
        if(member){
            throw new ExceptionWithCode("Already a member!",200)
        }

        /*
        * Check if user has a request already pending
        * */
        const parkRequest = await ParkRequestRepo.model.query().where({parkId:park.id,memberId:user?.id}).first()
        if(parkRequest){
            throw new ExceptionWithCode("Request already sent!",200)
        }
        const result = await this.repo.join(park,user?.id)
        return this.apiResponse(result.message)
    }

    async acceptDeclineRequest({request}: HttpContextContract){
        const input = await request.validate(AcceptDeclineParkRequestValidator)
        const park = await this.repo.find(input.park_id)

        /*
        * Check if request exist
        * */
        const parkRequest = await ParkRequestRepo.model.query().where({parkId:park.id,memberId:input.member_id}).first()
        if(!parkRequest){
            throw new ExceptionWithCode('Record not found!',404)
        }

        /*
        * Accept/Decline join request
        * */
        const result = await this.repo.acceptDeclineRequest(parkRequest,input.accept)
        return this.apiResponse(result.message)
    }

    async unjoin({ request,auth }: HttpContextContract){
        const {user} = auth
        const input = await request.validate(JoinParkValidator)
        await this.repo.unjoin(input.park_id,user?.id)
        return this.apiResponse("Park left Successfully!")
    }

    async block({ request }: HttpContextContract){
        const input = await request.validate(BlockParkMemberValidator)
        const park = await this.repo.find(input.park_id)
        await this.repo.block(park,input.user_id)
        return this.apiResponse("User blocked Successfully!")
    }

    async getBlockList(ctx: HttpContextContract){
        const {user} = ctx.auth
        const belonging = await this.repo.belonging(ctx.request.param('id'),user?.id)
        if(!belonging){
            throw new ExceptionWithCode('Record not found!',404)
        }
        const res = await this.repo.getBlockList(ctx.request.param('id'))
        return this.apiResponse("Record Fetched Successfully!",res)
    }

    async show({ request,auth }: HttpContextContract) {
        const {user} = auth
        const res = await this.repo.parkDetails(request.param('id'),user?.id)
        if(!res){
            throw new ExceptionWithCode('Record not found!',404)
        }
        return this.apiResponse('Record fetched successfully!', res)
    }

    async index(ctx:HttpContextContract){
        const page = ctx.request.input('page', 1)
        const perPage = ctx.request.input('per-page', constants.PER_PAGE)
        const orderByColumn = ctx.request.input('order-column', 'title')
        const orderByValue = ctx.request.input('order', 'asc')
        const park = await this.repo.index(orderByColumn,orderByValue,page,perPage,ctx);
        return this.apiResponse('Record Fetched Successfully',park)
    }

    async checkTitleExist({request}: HttpContextContract){
        await request.validate(ParkExistValidator)
        return this.apiResponse("Park title is available",true)
    }

}
