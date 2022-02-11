import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiBaseController from "App/Controllers/Http/Api/ApiBaseController";
import RegisterParentValidator from "App/Validators/RegisterParentValidator";
import AuthRepo from "App/Repos/AuthRepo";
import OtpRepo from "App/Repos/OtpRepo";
import UserDeviceRepo from "App/Repos/UserDeviceRepo";
///import User from "App/Models/User";
// import Helper from "App/Helpers/Helper";
// import UserHelper from "App/Helpers/UserHelper";
import VerifyEmail from "App/Mailers/VerifyEmail";
// import OtpRepository from "App/Repos/OtpRepository";
import ResendSignupOtpValidator from "App/Validators/ResendSignupOtpValidator";
// import VerifyEmailValidator from "App/Validators/VerifyEmailValidator";
// import LoginValidator from "App/Validators/LoginValidator";
//import ResetPassword from "App/Mailers/ResetPassword";
// import ResetPasswordValidator from "App/Validators/ResetPasswordValidator";
import UserRepo from "App/Repos/UserRepo";
import Role from 'App/Models/Role'
// import RoleHelper from "App/Helpers/RoleHelper";
// import Role from "App/Models/Role";
// import ForgotPasswordValidator from "App/Validators/ForgotPasswordValidator";
// import VerifyOtpValidator from "App/Validators/VerifyOtpValidator";

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
        const otp = {type:'register',userId:user.id,email:user.email}
        const code = await OtpRepo.generateOTP(otp)

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

    // public async resend_signup_otp( { response,request }: HttpContextContract ) {
    //
    //     await request.validate(ResendSignupOtpValidator)
    //     const input = request.all();
    //     await OtpRepo.model.query().where('email', input.email).delete();
    //     let user = await UserRepo.model.findBy('email', input.email);
    //     if(user){
    //         const otp = {type:'register',userId:user.id,email:user.email}
    //         const code = await OtpRepo.generateOTP(otp)
    //
    //         /* Send Email */
    //         const subject:string = 'Please verify your email address.'
    //         await new VerifyEmail(user, code, subject).sendLater()
    //         return this.globalResponse(response,true,"An OTP has been sent to your email address",{user: user})
    //     }else{
    //         return this.globalResponse(response,false,'User not found.')
    //     }
    // }
//
//     public async verify_email( { response,request }: HttpContextContract ){
//         try {
//             await request.validate(VerifyEmailValidator)
//         } catch (error) {
//             return this.sendValidationError(error,response)
//         }
//
//         const input = request.all();
//         let otpMinTime:any = Helper.getOtpMinTime();
//         let otp:any = await OtpRepository.model.query().where('email', input.email).where('code', input.code).where('created_at', '>=',otpMinTime).orderBy('created_at','desc').first();
//         if(!otp){
//             return this.globalResponse(response,false,'OTP not found or is expired.')
//         }
//
//         let user = await UserRepo.model.find(otp.user_id)
//         if(!user){
//             return this.globalResponse(response,false,'User not found.')
//         }
//
//         user.is_verified = true
//         if( !await user.save() ){
//             return this.globalResponse(response,false,'Failed to verify user. Please try again.')
//         }
//         otp.delete()
//         return this.globalResponse(response,true,'OTP verified successfully !')
//     }
//
//     public async login( { response, auth, request }: HttpContextContract ){
//
//         let input:any
//         try {
//             input = await request.validate(LoginValidator)
//         } catch (error) {
//             return this.sendValidationError(error,response)
//         }
//
//         let user = await User.findBy('email', input.email)
//         if(user){
//             let token
//             try {
//                 token = await auth.use('api').attempt(input.email, input.password)
//             } catch {
//                 return this.globalResponse(response,false,'Incorrect email or password.')
//             }
//
//             if (user.is_verified) {
//                 if (await RoleHelper.has_role(user,Role.TASKER)) {
//                    let tasker:any = await user.related('tasker').query().first()
//                     if(!tasker.isApproved){
//                         return this.globalResponse(response,false,'Your account has not been approved yet !')
//                     }
//                 }
//                 return this.globalResponse(response,true,'Logged in successfully !',{user:user,token:token})
//             }else{
//                 await auth.use('api').revoke()
//                 return this.globalResponse(response,false,'Email not verified. Please verify your email.')
//             }
//         }
//
//         return this.globalResponse(response,false,'Incorrect email or password.')
//     }
//
//     async forgotPassword({request,response}: HttpContextContract) {
//
//         let input:any
//         try {
//             input = await request.validate(ForgotPasswordValidator)
//         } catch (error) {
//             return this.sendValidationError(error,response)
//         }
//
//         let user = await UserRepo.model.findBy('email',input.email);
//         if (!user) {
//             return this.globalResponse(response,false,'User not found.',null,404)
//         }
//         await OtpRepository.model.query().where('email', user.email).delete();
//         const code:number = UserHelper.generateOTP(user.id,user.email)
//         let message:any
//         if(input.via == 'email'){
//             /* Send Email */
//             const subject = 'Reset Password OTP'
//             await new ResetPassword(user, code, subject).sendLater()
//             message = "An OTP has been sent to your email address"
//         }else if(input.via == 'phone'){
//             let last_three:any = user.phone.substring(user.phone.length-3, user.phone.length)
//             let number:string = "*".repeat(user.phone.length-3)+last_three
//             message = `An OTP has been sent to ${number}`
//         }
//         return this.globalResponse(response,true,message,{user: user})
//     }
//
//     async verifyOtp({request, response}) {
//         let input:any
//         try {
//             input = await request.validate(VerifyOtpValidator)
//         } catch (error) {
//             return this.sendValidationError(error,response)
//         }
//
//         let otpMinTime:any = Helper.getOtpMinTime();
//         let otp = await OtpRepository.model.query().where('email', input.email).where('code', input.code).where('created_at', '>=',otpMinTime).orderBy('created_at','desc').first();
//         if(otp){
//             return this.globalResponse(response,true,"OTP is valid.")
//         }else{
//             return this.globalResponse(response,false,"OTP not found is expired.")
//         }
//     }
//
//     public async reset_password( { response,request }: HttpContextContract ){
//
//         let input
//         try {
//             input = await request.validate(ResetPasswordValidator)
//         } catch (error) {
//             return this.sendValidationError(error,response)
//         }
//
//         let otpMinTime = Helper.getOtpMinTime();
//         let otp = await OtpRepository.model.query().where('email', input.email).where('code', input.code).where('created_at', '>=',otpMinTime).orderBy('created_at','desc').first();
//         if(otp){
//             let user = await User.find(otp.user_id)
//             if(user){
//                 user.password = input.password
//                 if( !await user.save() ){
//                     return this.globalResponse(response,false,"Failed to update password. Please try again.")
//                 }
//                 otp.delete()
//                 return this.globalResponse(response,true,"Password updated successfully !",{user:user})
//             }
//             return this.globalResponse(response,false,'User not found.',null,404)
//         }else{
//             return this.globalResponse(response,false,'OTP not found or is expired.')
//         }
//     }
//
//     public async profile({auth,response}: HttpContextContract){
//         let { user }:any = auth
//
//         return this.globalResponse(response,true,"Profile Retrieved Successfully!",user)
//     }
//
//     public async logout({auth, response}:HttpContextContract){
//         await auth.use('api').revoke()
//         return this.globalResponse(response,true,'Logged out successfully !',{revoked:true})
//     }
//
}
