import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import UserRepo from 'App/Repos/UserRepo'
import EditParentProfileValidator from 'App/Validators/EditParentProfileValidator'
import EditBusinessProfileValidator from 'App/Validators/EditBusinessProfileValidator'
import BusinessRepo from 'App/Repos/BusinessRepo'
import Hash from "@ioc:Adonis/Core/Hash"
import ChangePasswordValidator from 'App/Validators/ChangePasswordValidator'
import UserPhoneValidator from 'App/Validators/UserPhoneValidator'

export default class UsersController extends ApiBaseController{

    public async profile( { response, auth }: HttpContextContract ){
        const { user } = auth
        const profile = await UserRepo.profile(user)
        return this.globalResponse(response,true,"Profile Retrieved Successfully!",profile)
    }

    public async updateParentProfile( { request,response,auth }: HttpContextContract ){
        const { user }:any = auth
        await request.validate(EditParentProfileValidator)
        const profile = await UserRepo.update(user.id,request.only(UserRepo.model.fillables))
        return this.globalResponse(response,true,"Profile Updated Successfully!",profile)
    }

    public async updateBusinessProfile( { request,response,auth }: HttpContextContract ){
        const { user }:any = auth
        const input = await request.validate(EditBusinessProfileValidator)
        let userDetails = {...request.only(UserRepo.model.fillables),name:input.business_name}
        await UserRepo.update(user.id,userDetails)
        await BusinessRepo.update(user,request.only(BusinessRepo.model.fillables),request)
        const profile = await UserRepo.profile(user.id)
        return this.globalResponse(response,true,"Profile Updated Successfully!",profile)
    }

    async changePassword({request, auth, response}: HttpContextContract) {
        let { user }:any = auth
        let input:any = await request.validate(ChangePasswordValidator)

        if(! await Hash.verify(user.password,input.current_password)){
            return this.globalResponse(response,false,"Invalid current password.")
        }

        user.password = request.input('password')
        await user.save()
        return this.globalResponse(response,true,"Password Changed Successfully")
    }

    /*
    * API incomplete (Will be completed after friends API)
    * */
    async getUserByPhone({request, response}: HttpContextContract){
        let input:any = await request.validate(UserPhoneValidator)
        return this.globalResponse(response,true,"Password Changed Successfully",input)
    }
}
