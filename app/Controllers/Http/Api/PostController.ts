import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import PostRepo from "App/Repos/PostRepo";
import AddPostValidator from "App/Validators/AddPostValidator";
import EditPostValidator from "App/Validators/EditPostValidator";
import AttachmentRepo from 'App/Repos/AttachmentRepo'

export default class PostController extends ApiBaseController {

    constructor() {
        super(PostRepo)
    }

    async createPost({request,auth}: HttpContextContract) {
        const {user}:any = auth
        await request.validate(AddPostValidator)
        const input = request.only(this.repo.model.fillables())
        let row = await PostRepo.createPost({...input,userId:user.id}, request)
        return this.apiResponse('Record Added Successfully', row)
    }

    async updatePost(ctx: HttpContextContract): Promise<{ data: any; message: string; status: boolean }> {
        const {user}:any = ctx.auth
        await ctx.request.validate(EditPostValidator)
        if(! await this.repo.belonging(ctx)){
            return this.globalResponse(ctx.response,false,'Record not found!',null,404)
        }
        if(ctx.request.input('remove_media') && !await AttachmentRepo.checkAllBelonging(ctx.request.input('remove_media'),user.id)){
            return this.globalResponse(ctx.response,false,'Invalid attachment!',null,403)
        }
        const input = ctx.request.only(this.repo.model.fillables())
        const row = await this.repo.updatePost(ctx.request.param('id'),input, ctx.request)
        return this.apiResponse('Record Updated Successfully', row)
    }

    async update(ctx: HttpContextContract, instanceType?: number, mediaType?: String): Promise<{ data: any; message: string; status: boolean }> {
        await ctx.request.validate(AddPostValidator)
        return super.update(ctx, instanceType, mediaType)
    }

    async destroy(ctx:HttpContextContract){
        if(! await this.repo.belonging(ctx)){
            return this.globalResponse(ctx.response,false,'Record not found!',null,404)
        }
        await AttachmentRepo.removeAttachments({instanceId:ctx.request.param('id'),instanceType:AttachmentRepo.model.TYPE.POST})
        await this.repo.delete(ctx.request.param('id'))
        return this.apiResponse('Record Deleted Successfully')
    }

}
