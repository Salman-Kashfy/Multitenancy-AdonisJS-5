import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiBaseController from "App/Controllers/Http/Api/ApiBaseController";
import RegisterParentValidator from "App/Validators/RegisterParentValidator";
import AuthRepo from "App/Repos/AuthRepo";
import OtpRepo from "App/Repos/OtpRepo";
import OtpInterface from 'App/Interfaces/OtpInterface'
import UserDeviceRepo from "App/Repos/UserDeviceRepo";
import VerifyEmail from "App/Mailers/VerifyEmail";
import SendOtpValidator from "App/Validators/SendOtpValidator";
import VerifyEmailValidator from "App/Validators/VerifyEmailValidator";
import LoginValidator from "App/Validators/LoginValidator";
import ResetPassword from "App/Mailers/ResetPassword";
import ResetPasswordValidator from "App/Validators/ResetPasswordValidator";
import UserRepo from "App/Repos/UserRepo";
import Role from "App/Models/Role";
import ForgotPasswordValidator from "App/Validators/ForgotPasswordValidator";
import VerifyOtpValidator from "App/Validators/VerifyOtpValidator";

export default class AuthController extends ApiBaseController{

    public async signupParent( { response, request }: HttpContextContract ){
        let input = await request.validate(RegisterParentValidator)
        let user = await AuthRepo.findByEmail(input.email)

        /*
        * Verifications before sign-up
        * */
        const validate = await AuthRepo.beforeSignup(user)
        if(!validate.status){
            return response.status(200).send(validate)
        }

        /*
        * Create User
        * */
        user = await AuthRepo.createParent(request.only(UserRepo.model.fillables))
        if(!user){
            return this.globalResponse(response,false,'Failed to register user.')
        }

        /*
        * Assign User Role
        * */
        await user.related('roles').sync([Role.PARENT])

        /*
        * Create OTP
        * */
        const otp:OtpInterface = {email:input.email,userId:user.id,type:'signup'}
        const code = await OtpRepo.sendOTP(otp)

        /* Create User Device */
        if(input.device_type && input.device_token){
            const device = {
                userId:user.id,
                deviceType:input.device_type,
                deviceToken:input.device_token,
            }
            await UserDeviceRepo.updateOrCreate(device)
        }

        /* Send Email */
        const subject = 'Please verify your email address.'
        await new VerifyEmail(user, code, subject).sendLater()
        return this.globalResponse(response,true,"An OTP has been sent to your email address",{user: user})
    }

    public async resendSignupOtp( { response,request }: HttpContextContract ) {
        let input = await request.validate(SendOtpValidator)
        const user = await AuthRepo.findByEmail(input.email)
        if(!user){
            return this.globalResponse(response,false,'User not found.',null,404)
        }

        /* Send OTP */
        const otp:OtpInterface = {...input,userId:user.id,type:'signup'}
        const code = await OtpRepo.sendOTP(otp)

        /* Send Email */
        const subject:string = 'Please verify your email address.'
        await new VerifyEmail(user, code, subject).sendLater()
        return this.globalResponse(response,true,"An OTP has been sent to your email address.",{user: user})
    }

    public async verifyEmail( { response,request }: HttpContextContract ) {
        const input = await request.validate(VerifyEmailValidator)
        const user = await AuthRepo.findByEmail(input.email)
        if (!user) {
            return this.globalResponse(response, false, 'User not found.', null, 404)
        }

        /*
        * Return if user is already verified
        * */
        if(user.emailVerified){
            return this.globalResponse(response, false, 'This email is already verified.')
        }

        /*
        * Verify OTP TTL
        * */
        const validate = await OtpRepo.verifyEmail({ ...input });
        if(!validate.status){
            return this.globalResponse(response, false, validate.message)
        }

        /*
        * Set user is verified
        * */
        user.emailVerified = true
        if( !await user.save() ){
            return this.globalResponse(response,false,'Failed to verify user. Please try again.')
        }

        /*
        * Delete OTP and send response
        * */
        validate.data.delete()
        return this.globalResponse(response,true,'OTP verified successfully !')
    }

    public async login( { response, auth, request }: HttpContextContract ){

        const input = await request.validate(LoginValidator)
        let user = await AuthRepo.findByEmail(input.email)
        if (!user) {
            return this.globalResponse(response, false, 'User not found.', null, 404)
        }

        /*
        * Verifications before login
        * */
        const validate = await AuthRepo.login(input,user,auth)
        if(!validate.status){
            return this.globalResponse(response,false,validate.message)
        }

        /* Create User Device */
        const device = {
            userId:user.id,
            deviceType:input.device_type,
            deviceToken:input.device_token,
        }
        await UserDeviceRepo.updateOrCreate(device)

        return this.globalResponse(response,true,validate.message,validate.data)
    }

    async forgotPassword({request,response}: HttpContextContract) {

        const input = await request.validate(ForgotPasswordValidator)
        let user = await AuthRepo.findByEmail(input.email)
        if (!user) {
            return this.globalResponse(response, false, 'User not found.', null, 404)
        }

        /*
        * Create OTP
        * */
        const otp:OtpInterface = {email:input.email,userId:user.id,type:'reset-password'}
        const code = await OtpRepo.sendOTP(otp)

        let message:any
        if(input.via == 'email'){
            /* Send Email */
            const subject = 'Reset Password OTP'
            await new ResetPassword(user, code, subject).sendLater()
            message = "An OTP has been sent to your email address"
        }else if(input.via == 'phone'){
            let last_three:any = user.phone.substring(user.phone.length-3, user.phone.length)
            let number:string = "*".repeat(user.phone.length-3)+last_three
            message = `An OTP has been sent to ${number}`
        }
        return this.globalResponse(response,true,message,{user: user})
    }

    async verifyOtp({request, response}) {
        let input = await request.validate(VerifyOtpValidator)
        const validate = await OtpRepo.verifyOtp(input)
        return this.globalResponse(response,validate.status,validate.message)
    }

    public async resetPassword( { response,request }: HttpContextContract ){

        const input = await request.validate(ResetPasswordValidator)
        let user = await AuthRepo.findByEmail(input.email)
        if (!user) {
            return this.globalResponse(response, false, 'User not found.', null, 404)
        }

        const validate = await OtpRepo.verifyOtp({...input,type:'reset-password'})
        if(!validate.status){
            return this.globalResponse(response,false,validate.message)
        }

        user.password = input.password
        if( !await user.save() ){
            return this.globalResponse(response,false,"Failed to update password. Please try again.")
        }
        validate.data.delete()
        return this.globalResponse(response,true,"Password updated successfully !",{user:user})
    }

    public async profile({auth,response}: HttpContextContract){
        let { user }:any = auth
        return this.globalResponse(response,true,"Profile Retrieved Successfully!",user)
    }

    public async logout({auth, response}:HttpContextContract){
        await auth.use('api').revoke()
        return this.globalResponse(response,true,'Logged out successfully !',{revoked:true})
    }
//
}
