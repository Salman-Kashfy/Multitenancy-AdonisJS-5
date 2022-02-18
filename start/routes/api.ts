import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    /*
    |--------------------------------------------------------------------------
    | Guest Api Routes
    |--------------------------------------------------------------------------
    */
    Route.group(() => {

        // Login | Register | Verify email
        Route.post('signup-parent', 'Api/AuthController.signupParent')
        Route.post('resend-signup-otp', 'Api/AuthController.resendSignupOtp')
        Route.post('verify-email', 'Api/AuthController.verifyEmail')
        Route.post('login', 'Api/AuthController.login')
        Route.post('social-login', 'Api/AuthController.socialLogin')
        Route.post('signup-business', 'Api/AuthController.signupBusiness')

        // Reset Password
        Route.post('forgot-password', 'Api/AuthController.forgotPassword')
        Route.post('verify-otp', 'Api/AuthController.verifyOtp')
        Route.post('reset-password', 'Api/AuthController.resetPassword')
    }).middleware('guest')

    Route.post('logout', 'Api/AuthController.logout')

    /*
    |--------------------------------------------------------------------------
    | Authenticated Api Routes
    |--------------------------------------------------------------------------
    */
    Route.group(() => {

        // User Related
        Route.get('user/profile', 'Api/UsersController.profile')
        Route.put('user/update-parent-profile', 'Api/UsersController.updateParentProfile').middleware('parent')
        Route.put('user/update-business-profile', 'Api/UsersController.updateBusinessProfile').middleware('business')
        Route.put('change-password', 'Api/UsersController.changePassword')
        Route.get('user/get-users-by-phone', 'Api/UsersController.getUsersByPhone')

        // Static Data Routes
        Route.get('sizes/all','Api/SizeController.all')
        Route.get('genders/all','Api/GenderController.all')
        Route.get('breeds/all','Api/BreedController.all')

        // Dog Route
        Route.get('my-dogs','Api/DogController.myDogs')
        Route.resource('dogs','Api/DogController')

        // Blocked Users Route
        Route.get('blocked-users','Api/BlockedUserController.blockedUsers')
        Route.post('blocked-users','Api/BlockedUserController.blockOrUnblock')
        //Route.resource('blocked-users','Api/BlockedUserController')

    }).middleware('auth')

}).prefix('/api')