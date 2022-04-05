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
import CustomAlertNotifyValidator from 'App/Validators/CustomAlertNotifyValidator'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import constants from 'Config/constants'
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import EditUserValidator from 'App/Validators/EditUserValidator'
import CheckEmailExistValidator from 'App/Validators/CheckEmailExistValidator'

export default class UsersController extends ApiBaseController{

    constructor() {
        super(UserRepo)
    }

    async show( { request }: HttpContextContract ){
        const user = await this.repo.find(request.param('id'))
        if(!user){
            throw new ExceptionWithCode("User not found!",404)
        }
        const profile = await this.repo.profile(user.id)
        return this.apiResponse("Profile Retrieved Successfully!",profile)
    }

    async updateParentProfile( { request,auth }: HttpContextContract ){
        const { user }:any = auth
        await request.validate(EditParentProfileValidator)
        const profile = await this.repo.update(user.id,request.only(this.repo.fillables()))
        return this.apiResponse("Profile Updated Successfully!",profile)
    }

    async updateBusinessProfile( { request,auth }: HttpContextContract ){
        const { user } = auth
        const input = await request.validate(EditBusinessProfileValidator)
        let userDetails = {...request.only(this.repo.fillables()),name:input.business_name}
        await this.repo.update(user?.id,userDetails)
        await BusinessRepo.update(user,request.only(BusinessRepo.fillables()),request)
        const profile = await this.repo.profile(user?.id)
        return this.apiResponse("Profile Updated Successfully!",profile)
    }

    async changePassword({request, auth}: HttpContextContract) {
        let { user }:any = auth
        let input = await request.validate(ChangePasswordValidator)

        if(! await Hash.verify(user.password,input.current_password)){
            throw new ExceptionWithCode("Invalid current password.",200)
        }

        user.password = request.input('password')
        await user.save()
        return this.apiResponse("Password Changed Successfully")
    }

    async getUsersByPhone({request}: HttpContextContract){
        let input = await request.validate(UserPhoneValidator)
        const result = await this.repo.getUsersByPhone(input.contacts)
        return this.apiResponse("Record Fetched Successfully",result)
    }

    async invite({request, auth}: HttpContextContract){
        const { user } = auth
        const input = await request.validate(UserInviteValidator)
        await this.repo.invite(input,user)
        return this.apiResponse("Invitation Sent Successfully!")
    }

    async suggestedFriends(ctx: HttpContextContract){
        const page = ctx.request.input('page', 1)
        const perPage = ctx.request.input('per-page', constants.PER_PAGE)
        const orderByColumn = ctx.request.input('order-column', constants.ORDER_BY_COLUMN)
        const orderByValue = ctx.request.input('order', constants.ORDER_BY_VALUE)
        const res = await this.repo.suggestedFriends(orderByColumn,orderByValue,page,perPage,ctx)
        return this.apiResponse('Record fetched successfully!', res)
    }

    async checkUsername({request}: HttpContextContract){
        await request.validate(UsernameExistValidator)
        return this.apiResponse("Username is available",true)
    }

    async checkBusinessName({request}: HttpContextContract){
        await request.validate(BusinessExistValidator)
        return this.apiResponse("Business name is available",true)
    }

    async statistics({auth}: HttpContextContract){
        const {user} = auth
        const stats = await this.repo.statistics(user?.id)
        return this.apiResponse('Record fetched successfully!', stats)
    }

    async sendAlerts({request}:HttpContextContract){
        const input = await request.validate(CustomAlertNotifyValidator)
        await this.repo.sendAlerts(input)
        return this.apiResponse("Notifications Sent!",true)
    }

    async adminUpdate(ctx:HttpContextContract){
        const input = await ctx.request.validate(EditUserValidator)
        const res = await this.repo.update(ctx.request.param('id'), input, ctx.request)
        return this.apiResponse('Record updated successfully!', res)
    }

    async store(ctx:HttpContextContract){
        const input = await ctx.request.validate(CreateUserValidator)
        if(!input.roles || !input.roles.length){
            throw new ExceptionWithCode('At least one role is required',422)
        }
        const user = await this.repo.store({...input,email_verified:1})
        return super.apiResponse(`User Created Successfully!`, user)
    }

    async all(ctx: HttpContextContract) {
        let orderByColumn = ctx.request.input('order-column', constants.ORDER_BY_COLUMN)
        let orderByValue = ctx.request.input('order', constants.ORDER_BY_VALUE)
        let rows = await this.repo.all(orderByColumn, orderByValue, ctx)
        return this.apiResponse('Records fetched successfully', rows)
    }

    async checkEmailExist({request}: HttpContextContract) {
        await request.validate(CheckEmailExistValidator)
        return this.apiResponse("Email is available",true)
    }

}
