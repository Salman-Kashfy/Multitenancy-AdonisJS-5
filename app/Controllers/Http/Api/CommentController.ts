import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import CommentRepo from "App/Repos/CommentRepo";
import AddCommentValidator from "App/Validators/AddCommentValidator";
import EditCommentValidator from "App/Validators/EditCommentValidator";
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import GlobalResponseInterface from 'App/Interfaces/GlobalResponseInterface'

export default class CommentController extends ApiBaseController {

    constructor() {
        super(CommentRepo)
    }

    async store({request,auth}: HttpContextContract) {
        await request.validate(AddCommentValidator)
        const {user} = auth
        let input = request.only(this.repo.fillables())
        let row = await this.repo.store({...input,user_id:user?.id}, request)
        return this.apiResponse('Record Added Successfully', row)
    }

    async update(ctx: HttpContextContract): Promise<GlobalResponseInterface> {
        await ctx.request.validate(EditCommentValidator)
        const {user} = ctx.auth
        const belonging = await this.repo.belonging(ctx.request.param('id'),user?.id)
        if(!belonging){
            throw new ExceptionWithCode('Record not found!',404)
        }
        let input = ctx.request.only(this.repo.fillables())
        let row = await this.repo.update(ctx.request.param('id'),input, ctx.request)
        return this.apiResponse('Record Updated Successfully', row)
    }

    async destroy(ctx:HttpContextContract){
        const {user} = ctx.auth
        const belonging = await this.repo.belonging(ctx.request.param('id'),user?.id)
        if(!belonging){
            throw new ExceptionWithCode('Record not found!',404)
        }
        await this.repo.delete(ctx.request.param('id'))
        return this.apiResponse('Record Deleted Successfully')
    }
}
