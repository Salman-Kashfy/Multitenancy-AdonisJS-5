import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import UserRepo from 'App/Repos/UserRepo'
import EditParentProfileValidator from 'App/Validators/EditParentProfileValidator'
import EditBusinessProfileValidator from 'App/Validators/EditBusinessProfileValidator'
import BusinessRepo from 'App/Repos/BusinessRepo'
import Hash from "@ioc:Adonis/Core/Hash"
import ChangePasswordValidator from 'App/Validators/ChangePasswordValidator'
import UserPhoneValidator from 'App/Validators/UserPhoneValidator'
import UserInviteValidator from 'App/Validators/UserInviteValidator'
import UsernameExistValidator from 'App/Validators/UsernameExistValidator'
import BusinessExistValidator from 'App/Validators/BusinessExistValidator'
import constants from 'Config/constants'

export default class UsersController extends ApiBaseController{

    constructor() {
        super(UserRepo)
    }

    async show( { request,response }: HttpContextContract ){
        const user = await this.repo.find(request.param('id'))
        if(!user){
            return this.globalResponse(response,true,"User not found!",null,404)
        }
        const profile = await this.repo.profile(user)
        return this.globalResponse(response,true,"Profile Retrieved Successfully!",profile)
    }

    async updateParentProfile( { request,response,auth }: HttpContextContract ){
        const { user }:any = auth
        await request.validate(EditParentProfileValidator)
        const profile = await this.repo.update(user.id,request.only(this.repo.model.fillables))
        return this.globalResponse(response,true,"Profile Updated Successfully!",profile)
    }

    async updateBusinessProfile( { request,response,auth }: HttpContextContract ){
        const { user }:any = auth
        const input = await request.validate(EditBusinessProfileValidator)
        let userDetails = {...request.only(this.repo.model.fillables),name:input.business_name}
        await this.repo.update(user.id,userDetails)
        await BusinessRepo.update(user,request.only(BusinessRepo.model.fillables),request)
        const profile = await this.repo.profile(user.id)
        return this.globalResponse(response,true,"Profile Updated Successfully!",profile)
    }

    async changePassword({request, auth, response}: HttpContextContract) {
        let { user }:any = auth
        let input = await request.validate(ChangePasswordValidator)

        if(! await Hash.verify(user.password,input.current_password)){
            return this.globalResponse(response,false,"Invalid current password.")
        }

        user.password = request.input('password')
        await user.save()
        return this.globalResponse(response,true,"Password Changed Successfully")
    }

    async getUsersByPhone({request, response}: HttpContextContract){
        let input = await request.validate(UserPhoneValidator)
        const result = await this.repo.getUsersByPhone(input.contacts)
        return this.globalResponse(response,true,"Record Fetched Successfully",result)
    }

    async invite({request, response, auth}: HttpContextContract){
        const { user } = auth
        const input = await request.validate(UserInviteValidator)
        await this.repo.invite(input,user)
        return this.globalResponse(response,true,"Invitation Sent Successfully!")
    }

    async suggestedFriends(ctx: HttpContextContract){
        const page = ctx.request.input('page', 1)
        const perPage = ctx.request.input('per-page', constants.PER_PAGE)
        const orderByColumn = ctx.request.input('order-column', constants.ORDER_BY_COLUMN)
        const orderByValue = ctx.request.input('order', constants.ORDER_BY_VALUE)
        const res = await this.repo.suggestedFriends(orderByColumn,orderByValue,page,perPage,ctx)
        return this.apiResponse('Record fetched successfully!', res)
    }

    async checkUsername({request,response}: HttpContextContract){
        await request.validate(UsernameExistValidator)
        return this.globalResponse(response,true,"Username is available",true)
    }

    async checkBusinessName({request,response}: HttpContextContract){
        await request.validate(BusinessExistValidator)
        return this.globalResponse(response,true,"Business name is available",true)
    }

}
