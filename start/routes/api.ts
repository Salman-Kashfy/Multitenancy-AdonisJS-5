import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    /*
    |--------------------------------------------------------------------------
    | Guest Api Routes
    |--------------------------------------------------------------------------
    */
    Route.group(() => {
        // Login | Register | Verify email
        Route.post('register', 'Api/AuthController.register')
        Route.post('resend-signup-otp', 'Api/AuthController.resendSignupOtp')
        Route.post('verify-email', 'Api/AuthController.verifyEmail')
        // Route.post('login', 'Api/AuthController.login')
        // Route.post('admin-login', 'Api/AuthController.adminLogin')
        // Route.post('social-login', 'Api/AuthController.socialLogin')
        // Route.post('signup-business', 'Api/AuthController.signupBusiness')

        // Reset Password
        // Route.post('forgot-password', 'Api/AuthController.forgotPassword')
        // Route.post('verify-otp', 'Api/AuthController.verifyOtp')
        // Route.post('reset-password', 'Api/AuthController.resetPassword')
    }).middleware('guest')

    /*
    |--------------------------------------------------------------------------
    | Authenticated Api Routes
    |--------------------------------------------------------------------------
    */
    Route.group(() => {

    }).middleware('auth')
}).middleware('switchTenant').prefix('/api')