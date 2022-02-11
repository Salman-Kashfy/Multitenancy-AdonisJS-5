// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseRepo from 'App/Repos/BaseRepo'
import Otp from 'App/Models/Otp';
import OtpInterface from 'App/Interfaces/OtpInterface'

class OtpRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Otp, relations)
        this.model = Otp
    }

    async generateOTP(otp:OtpInterface){
        const code = Math.floor(10000 + Math.random() * 90000);
        await this.model.create({...otp,code});
        return code
    }
}

export default new OtpRepo()
