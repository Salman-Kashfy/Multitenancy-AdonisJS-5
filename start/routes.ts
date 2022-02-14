/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    /*
    |--------------------------------------------------------------------------
    | Guest API Routes
    |--------------------------------------------------------------------------
    */
    Route.group(() => {

        Route.get('test', () =>{
            return {status:'message'}
        })

        // Login | Register | Verify email
        Route.post('signup-parent', 'API/AuthController.signupParent')
        Route.post('resend-signup-otp', 'API/AuthController.resendSignupOtp')
        Route.post('verify-email', 'API/AuthController.verifyEmail')
        Route.post('login', 'API/AuthController.login')

        // Reset Password
        Route.post('forgot-password', 'API/AuthController.forgotPassword')
        Route.post('verify-otp', 'API/AuthController.verifyOtp')
        Route.post('reset-password', 'API/AuthController.resetPassword')
    }).middleware('guest')

    Route.post('logout', 'API/AuthController.logout')

    /*
    |--------------------------------------------------------------------------
    | Authenticated API Routes
    |--------------------------------------------------------------------------
    */
    Route.group(() => {
        Route.get('profile', 'API/AuthController.profile')

    }).middleware('auth')

}).prefix('/api')