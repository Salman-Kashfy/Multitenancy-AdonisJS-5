import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import DogRepo from "App/Repos/DogRepo";
import AddDogValidator from "App/Validators/AddDogValidator";
import EditDogValidator from "App/Validators/EditDogValidator";
import AttachmentRepo from 'App/Repos/AttachmentRepo'
import constants from 'Config/constants'

export default class DogController extends ApiBaseController {

    constructor() {
        super(DogRepo)
    }

    async index(ctx:HttpContextContract){
        const page = ctx.request.input('page', 1)
        const perPage = ctx.request.input('per-page', constants.PER_PAGE)
        const orderByColumn = ctx.request.input('order-column', constants.ORDER_BY_COLUMN)
        const orderByValue = ctx.request.input('order', constants.ORDER_BY_VALUE)
        const category = await this.repo.index(orderByColumn,orderByValue,page,perPage,ctx);
        return this.globalResponse(ctx.response,true,'Record Fetched Successfully',category)
    }

    async store({request,auth}: HttpContextContract) {
        const {user}:any = auth
        await request.validate(AddDogValidator)
        const input = request.only(this.repo.model.fillables())
        const row = await this.repo.store({...input,userId:user.id}, request)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract): Promise<{ data: any; message: string; status: boolean }> {
        const {user}:any = ctx.auth
        await ctx.request.validate(EditDogValidator)
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
        await AttachmentRepo.removeAttachments({instanceId:ctx.request.param('id'),instanceType:AttachmentRepo.model.TYPE.DOG})
        await this.repo.delete(ctx.request.param('id'))
        return this.apiResponse('Record Deleted Successfully')
    }

    async myDogs({auth}:HttpContextContract){
        const {user}:any = auth
        const row = await this.repo.myDogs(user.id)
        return this.apiResponse('Record Fetched Successfully',row)
    }

}