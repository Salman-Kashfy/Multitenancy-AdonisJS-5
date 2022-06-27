import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import AuthRepo from 'App/Repos/AuthRepo'
import UserDeviceRepo from 'App/Repos/UserDeviceRepo'
import UserRepo from 'App/Repos/UserRepo'
import ExceptionWithCode from 'App/Exceptions/ExceptionWithCode'
import RegisterValidator from 'App/Validators/RegisterValidator'
import { DateTime } from 'luxon'
import Event from '@ioc:Adonis/Core/Event'
import SendOtpValidator from 'App/Validators/SendOtpValidator'
import VerifyEmailValidator from 'App/Validators/VerifyEmailValidator'
import LoginValidator from 'App/Validators/LoginValidator'

export default class AuthController extends ApiBaseController {

    constructor() {
        super(AuthRepo)
    }

    public async register({ request }: HttpContextContract) {
        let input = await request.validate(RegisterValidator)
        let user = await this.repo.findByEmail(input.email)

        /*
        * Verifications before sign-up
        * */
        const validate = await this.repo.beforeSignup(user)
        if (!validate.status) {
            throw new ExceptionWithCode(validate.message, 200)
        }

        /*
        * Create User
        * */
        let fillables: string[] = UserRepo.fillables()
        const code = this.repo.generateOTP()
        let data = {
            ...request.only(fillables),
            otpCode:code,
            otpExpiry: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
        }
        user = await this.repo.register(data)
        if (!user) {
            throw new ExceptionWithCode('Failed to register user.', 200)
        }

        /*
        * Create User Device
        * */
        if (input.device_type && input.device_token) {
            const device = {
                userId: user.id,
                deviceType: input.device_type,
                deviceToken: input.device_token,
            }
            await UserDeviceRepo.updateOrCreate(device)
        }

        /*
        * Send Email
        * */
        Event.emit('new:user',user)
        user = await UserRepo.profile(user.id)
        return this.apiResponse('An OTP has been sent to your email address', { user: user })
    }

    public async resendSignupOtp( { request }: HttpContextContract ) {
        let input = await request.validate(SendOtpValidator)
        let user = await this.repo.findByEmail(input.email)
        if(!user){
            throw new ExceptionWithCode('User not found!',200)
        }

        /*
        * Return if user is already verified
        * */
        if(user.emailVerified){
            throw new ExceptionWithCode('This email is already verified.',200)
        }

        /*
        * Generate OTP
        * */
        user.otpCode = this.repo.generateOTP()
        user.otpExpiry = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
        await user.save()

        /*
        * Send Email
        * */
        Event.emit('new:user',user)
        user = await UserRepo.profile(user.id)
        return this.apiResponse('An OTP has been sent to your email address', { user: user })
    }

    public async login( { auth, request }: HttpContextContract ){
        const input = await request.validate(LoginValidator)
        let user = await this.repo.findByEmail(input.email)
        if (!user) {
            throw new ExceptionWithCode('User not found!',200)
        }

        if(user.isBlocked){
            throw new ExceptionWithCode('You have been blocked! Contact support for further information.',403)
        }

        // Validations before login
        await this.repo.beforeLogin(user,[RoleRepo.model.PARENT,RoleRepo.model.BUSINESS])

        const token = await this.repo.login(input,auth)
        user = await UserRepo.profile(user.id)

        /* Create User Device */
        const device = {
            userId:user.id,
            deviceType:input.device_type,
            deviceToken:input.device_token,
        }
        await UserDeviceRepo.updateOrCreate(device)
        return this.apiResponse('Logged in successfully !',{user,token})
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
        const validate = await this.repo.verifyEmail(input);
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

        return this.apiResponse('OTP verified successfully !')
    }

}