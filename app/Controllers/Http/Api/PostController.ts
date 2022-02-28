import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import PostRepo from "App/Repos/PostRepo";
import CreatePostValidator from "App/Validators/CreatePostValidator";
import EditPostValidator from "App/Validators/EditPostValidator";
import CreateAlertValidator from "App/Validators/CreateAlertValidator";
import EditAlertValidator from "App/Validators/EditAlertValidator";
import SharePostValidator from "App/Validators/SharePostValidator";
import AttachmentRepo from 'App/Repos/AttachmentRepo'
import ParkRepo from 'App/Repos/ParkRepo'
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import constants from 'Config/constants'

export default class PostController extends ApiBaseController {

    constructor() {
        super(PostRepo)
    }

    async createPost({request,auth}: HttpContextContract) {
        const {user}:any = auth
        await request.validate(CreatePostValidator)
        const input = request.only(this.repo.model.fillables())
        await ParkRepo.filterNonParkMember(user,request.input('share_posts'))
        const hostParks = await ParkRepo.hostParks(user.id)
        await this.repo.applyPostLimits(user,request.input('share_posts'),hostParks)
        let row = await this.repo.createPost({...input,userId:user.id}, request)
        return this.apiResponse('Record Added Successfully', row)
    }

    async updatePost(ctx: HttpContextContract): Promise<{ data: any; message: string; status: boolean }> {
        const {user}:any = ctx.auth
        await ctx.request.validate(EditPostValidator)
        if(! await this.repo.belonging(ctx)){
            throw new ExceptionWithCode('Record not found!',404)
        }
        if(ctx.request.input('remove_media') && !await AttachmentRepo.checkAllBelonging(ctx.request.input('remove_media'),user.id)){
            throw new ExceptionWithCode('Permission denied!',403)
        }
        const input = ctx.request.only(this.repo.model.fillables())
        const row = await this.repo.update(ctx.request.param('id'),{...input,userId:user.id}, ctx.request)
        return this.apiResponse('Record Updated Successfully', row)
    }

    async destroy(ctx:HttpContextContract){
        if(! await this.repo.belonging(ctx)){
            throw new ExceptionWithCode('Record not found!',404)
        }
        await AttachmentRepo.removeAttachments({instanceId:ctx.request.param('id'),instanceType:AttachmentRepo.model.TYPE.POST})
        await this.repo.delete(ctx.request.param('id'))
        return this.apiResponse('Record Deleted Successfully')
    }

    async createAlert({request,auth}: HttpContextContract){
        const {user}:any = auth
        await request.validate(CreateAlertValidator)
        const input = request.only(this.repo.model.fillables())
        let row = await this.repo.createAlert({...input,userId:user.id}, request)
        return this.apiResponse('Record Added Successfully', row)
    }

    async updateAlert(ctx: HttpContextContract): Promise<{ data: any; message: string; status: boolean }> {
        const {user}:any = ctx.auth
        await ctx.request.validate(EditAlertValidator)
        if(! await this.repo.belonging(ctx)){
            throw new ExceptionWithCode('Record not found!',404)
        }
        if(ctx.request.input('remove_media') && !await AttachmentRepo.checkAllBelonging(ctx.request.input('remove_media'),user.id)){
            throw new ExceptionWithCode('Permission denied!',403)
        }
        const input = ctx.request.only(this.repo.model.fillables())
        const row = await this.repo.update(ctx.request.param('id'),{...input,userId:user.id}, ctx.request)
        return this.apiResponse('Record Updated Successfully', row)
    }

    async parkQuota({request,auth}: HttpContextContract){
        const {user} = auth
        const hostParks = await ParkRepo.hostParks(user?.id)
        await this.repo.applyPostLimits(user,[request.param('parkId')],hostParks)
        return this.apiResponse('You have enough quota')
    }

    async sharePost(ctx: HttpContextContract){
        let input = await ctx.request.validate(SharePostValidator)
        if(! await this.repo.exist(ctx)){
            throw new ExceptionWithCode('Record not found!',404)
        }
        const {user} = ctx.auth
        await ParkRepo.filterNonParkMember(user,ctx.request.input('share_posts'))
        await this.repo.filterOriginal(ctx.request.param('id'))
        await this.repo.sharePost(ctx.request.param('id'),{...input,user_id:user?.id})
        return this.apiResponse('Post Shared Successfully !')
    }

    async getShareList(ctx:HttpContextContract){
        const page = ctx.request.input('page', 1)
        const perPage = ctx.request.input('per-page', constants.PER_PAGE)
        const orderByColumn = ctx.request.input('order-column', constants.ORDER_BY_COLUMN)
        const orderByValue = ctx.request.input('order', constants.ORDER_BY_VALUE)
        const shares = await this.repo.getShareList(orderByColumn,orderByValue,page,perPage,ctx);
        return this.apiResponse('Record Fetched Successfully',shares)
    }

}
