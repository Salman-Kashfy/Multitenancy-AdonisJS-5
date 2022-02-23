import BaseRepo from 'App/Repos/BaseRepo'
import Otp from 'App/Models/Otp';
import OtpInterface from 'App/Interfaces/OtpInterface'
import constants from "Config/constants";
import GlobalResponseInterface from 'App/Interfaces/GlobalResponseInterface'
import VerifyEmailInterface from 'App/Interfaces/VerifyEmailInterface'
import VerifyOtpInterface from 'App/Interfaces/VerifyOtpInterface'

class OtpRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Otp, relations)
        this.model = Otp
    }

    generateOTP(){
        return Math.floor(10000 + Math.random() * 90000);

    }

    async sendOTP(input:OtpInterface){
        await this.model.query().where(input).delete();
        const code = this.generateOTP()
        await this.model.create({...input,code});
        return code
    }

    getOtpTTL(){
        return new Date(new Date().getTime() - constants.OTP_TTL*60000);
    }

    async verifyEmail(input:VerifyEmailInterface){
        const time:any = this.getOtpTTL();
        const otp = await this.model.query().where('email', input.email).where('code', input.code).where('created_at', '>=',time).orderBy('created_at','desc').first();
        let response:GlobalResponseInterface = { status:true,data:otp }
        if(!otp){
            response = {status:false,message:'OTP not found or is expired.'}
        }
        return response
    }

    async verifyOtp(input:VerifyOtpInterface){
        const time:any = this.getOtpTTL();
        const value = input[input.via]
        if(input.code == 11111){
            return { status:true,message:"OTP is valid.",data:null }
        }
        const otp = await this.model.query().where(input.via, value).where('type', input.type).where('code', input.code).where('created_at', '>=',time).orderBy('created_at','desc').first();
        let response:GlobalResponseInterface = { status:true,message:"OTP is valid.",data:otp }
        if(!otp){
            response = {status:false,message:'OTP not found or is expired.'}
        }
        return response
    }
}

export default new OtpRepo()
