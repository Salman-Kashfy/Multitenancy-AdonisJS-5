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
import RoleRepo from "App/Repos/RoleRepo";
import ForgotPasswordValidator from "App/Validators/ForgotPasswordValidator";
import VerifyOtpValidator from "App/Validators/VerifyOtpValidator";
import LogoutValidator from "App/Validators/LogoutValidator";
import SocialLoginValidator from "App/Validators/SocialLoginValidator";
import SocialAccountRepo from "App/Repos/SocialAccountRepo";
import RegisterBusinessValidator from 'App/Validators/RegisterBusinessValidator'
import BusinessRepo from 'App/Repos/BusinessRepo'
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'

export default class AuthController extends ApiBaseController{
    
    constructor() {
        super(AuthRepo)
    }

    public async signupParent( { request }: HttpContextContract ){
        let input = await request.validate(RegisterParentValidator)
        let user = await this.repo.findByEmail(input.email)

        /*
        * Verifications before sign-up
        * */
        const validate = await this.repo.beforeSignup(user)
        if(!validate.status){
            throw new ExceptionWithCode(validate.message,200)
        }

        /*
        * Create Parent User
        * */
        let fillables:string[] = UserRepo.fillables()
        user = await this.repo.createParent(request.only(fillables))
        if(!user){
            throw new ExceptionWithCode('Failed to register user.',200)
        }

        /*
        * Assign User Role
        * */
        await user.related('roles').sync([RoleRepo.model.PARENT])

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
        user = await UserRepo.profile(user.id)
        return this.apiResponse("An OTP has been sent to your email address",{user: user})
    }

    public async resendSignupOtp( { request }: HttpContextContract ) {
        let input = await request.validate(SendOtpValidator)
        const user = await this.repo.findByEmail(input.email)
        if(!user){
            throw new ExceptionWithCode('User not found!',200)
        }

        /*
        * Return if user is already verified
        * */
        if(user.emailVerified){
            throw new ExceptionWithCode('This email is already verified.',200)
        }

        /* Send OTP */
        const otp:OtpInterface = {...input,userId:user.id,type:'signup'}
        const code = await OtpRepo.sendOTP(otp)

        /* Send Email */
        const subject:string = 'Please verify your email address.'
        await new VerifyEmail(user, code, subject).sendLater()
        return this.apiResponse("An OTP has been sent to your email address.",{user: user})
    }

    public async verifyEmail( { request }: HttpContextContract ) {
        const input = await request.validate(VerifyEmailValidator)
        const user = await this.repo.findByEmail(input.email)
        if (!user) {
            throw new ExceptionWithCode('User not found!',200)
        }

        /*
        * Verify OTP TTL
        * */
        const validate = await OtpRepo.verifyEmail({ ...input });
        if(!validate.status){
            throw new ExceptionWithCode(validate.message,200)
        }

        /*
        * Set user is verified
        * */
        user.emailVerified = true
        if( !await user.save() ){
            return this.apiResponse('Failed to verify user. Please try again.')
        }

        /*
        * Delete OTP and send response
        * */
        validate.data.delete()
        return this.apiResponse('OTP verified successfully !')
    }

    public async login( { auth, request }: HttpContextContract ){

        const input = await request.validate(LoginValidator)
        let user = await this.repo.findByEmail(input.email)
        if (!user) {
            throw new ExceptionWithCode('User not found!',200)
        }

        /*
        * Verifications before login
        * */
        const validate = await this.repo.login(input,user,auth)

        /* Create User Device */
        const device = {
            userId:user.id,
            deviceType:input.device_type,
            deviceToken:input.device_token,
        }
        await UserDeviceRepo.updateOrCreate(device)

        return this.apiResponse(validate.message,validate.data)
    }

    public async forgotPassword({request}: HttpContextContract) {

        const input = await request.validate(ForgotPasswordValidator)
        let user = await this.repo.findByEmail(input.email)
        if (!user) {
            throw new ExceptionWithCode('User not found!',200)
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
        return this.apiResponse(message,{user: user})
    }

    public async verifyOtp({request}) {
        let input = await request.validate(VerifyOtpValidator)
        const validate = await OtpRepo.verifyOtp(input)
        if(!validate.status){
            throw new ExceptionWithCode(validate.message,200)
        }
        return this.apiResponse(validate.message)
    }

    public async resetPassword( { request }: HttpContextContract ){

        const input = await request.validate(ResetPasswordValidator)
        let user = await this.repo.findByEmail(input.email)
        if (!user) {
            throw new ExceptionWithCode('User not found!',200)
        }

        const validate = await OtpRepo.verifyOtp({...input,type:'reset-password'})
        if(!validate.status){
            throw new ExceptionWithCode(validate.message,200)
        }

        user.password = input.password
        if( !await user.save() ){
            throw new ExceptionWithCode("Failed to update password. Please try again.",200)
        }
        validate.data.delete()
        return this.apiResponse("Password updated successfully !",{user:user})
    }

    public async logout({request,auth}:HttpContextContract){
        const input = await request.validate(LogoutValidator)
        await this.repo.logout(input,auth)
        return this.apiResponse('Logged out successfully !',{revoked:true})
    }

    public async socialLogin({request,auth}: HttpContextContract) {
        await request.validate(SocialLoginValidator)
        let socialAccount = await SocialAccountRepo.findSocialLogin(request)
        let user;
        if (socialAccount) {
            user = await UserRepo.find(socialAccount.user_id)
        }
        const userFillables:string[] = UserRepo.fillables()
        let input = request.only(userFillables)
        if (!user) {
            input.password = Math.random().toString(36).substring(2, 15)
            input.email_verified = 1;
            input.is_social_login = 1;

            user = await UserRepo.model.updateOrCreate({
                email: request.input('email', null)
            }, request.only(userFillables))

            await user.related('roles').sync([request.input('account_type')])
            await SocialAccountRepo.store(request, user.id)
        }
        if (input.image) {
            await UserRepo.update(user.id,{image: input.image})
        }

        /* Create User Device */
        const device = {
            userId:user.id,
            deviceType:request.input('device_type'),
            deviceToken:request.input('device_token'),
        }
        await UserDeviceRepo.updateOrCreate(device)

        let token = await auth.use('api').generate(user)
        const role = await user.related('roles').query().first()
        user = user.toJSON()
        return super.apiResponse(`Your account has been created successfully`, {user,token,role})
    }

    public async signupBusiness({request}: HttpContextContract){
        const input = await request.validate(RegisterBusinessValidator)
        let user = await this.repo.findByEmail(input.email)
        /*
        * Verifications before sign-up
        * */
        const validate = await this.repo.beforeSignup(user)
        if(!validate.status){
            throw new ExceptionWithCode(validate.message,200)
        }

        /*
        * Create Business User
        * */
        const userFillables:string[] = UserRepo.fillables()
        const businessFillables:string[] = BusinessRepo.fillables()
        user = await this.repo.createBusiness(request.only(userFillables),request.only(businessFillables),request)
        if(!user){
            throw new ExceptionWithCode('Failed to register user.',200)
        }

        /*
        * Assign User Role
        * */
        await user.related('roles').sync([RoleRepo.model.BUSINESS])

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
        user = await UserRepo.profile(user.id)
        return this.apiResponse("An OTP has been sent to your email address",{user: user})
    }

}
