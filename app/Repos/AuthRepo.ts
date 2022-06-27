import BaseRepo from 'App/Repos/BaseRepo'
import User from 'App/Models/User';
import UserDevice from 'App/Models/UserDevice'
import Role from 'App/Models/Role'
import VerifyEmailInterface from 'App/Interfaces/VerifyEmailInterface'
import constants from 'Config/constants'
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'

class AuthRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(User, relations)
        this.model = User
    }

    async beforeSignup(user){
        let status = true,message = ""
        if(user){
            if (user.emailVerified) {
                status = false
                message = 'Email already exist.'
            }else{
                await user.forceDelete()
            }
        }
        return {status,message}
    }

    async register(input){
        const user = await this.model.create(input);
        if(!user) return false
        await user.related('roles').sync([Role.USER])
        return user
    }

    generateOTP(){
        return Math.floor(10000 + Math.random() * 90000);
    }

    getOtpTTL(){
        return new Date(new Date().getTime() - constants.OTP_TTL*60000);
    }

    async verifyEmail(input:VerifyEmailInterface){
        const time:any = this.getOtpTTL();
        const otpCode = await this.model.query().where('email', input.email).where('otp_code', input.otpCode).where('otp_expiry', '>=',time).first();
        let response = { status:true,message:'',data:otpCode }
        if(!otpCode){
            response = {status:false,message:'OTP not found or is expired.', data:{}}
        }
        return response
    }

    async login(input,auth){
        return await auth.use('api').attempt(input.email, input.password)
    }

    async security(user){
        let result = { status:true, message:'', code:200 }
        if(user.isBlocked){
            result = { status:false, message:'You have been blocked! Contact support for further information.', code:403 }
        }
        return result
    }

    async logout(input,auth){
        await auth.use('api').revoke()
        await UserDevice.query()
            .where('device_token',input.device_token)
            .where('device_type',input.device_type)
            .delete()
    }
}

export default new AuthRepo()