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

        /*
        |--------------------------------------------------------------------------
        | User Related API Routes
        |--------------------------------------------------------------------------
        */
        Route.get('user/:id', 'Api/UsersController.show')
        Route.put('user/update-parent-profile', 'Api/UsersController.updateParentProfile').middleware('parent')
        Route.put('user/update-business-profile', 'Api/UsersController.updateBusinessProfile').middleware('business')
        Route.put('change-password', 'Api/UsersController.changePassword')
        Route.post('user/get-users-by-phone', 'Api/UsersController.getUsersByPhone')
        Route.post('user/invite', 'Api/UsersController.invite')

        /*
        |--------------------------------------------------------------------------
        | Static Data API Routes
        |--------------------------------------------------------------------------
        */
        Route.get('sizes/all','Api/SizeController.all')
        Route.get('genders/all','Api/GenderController.all')
        Route.get('breeds/all','Api/BreedController.all')

        /*
        |--------------------------------------------------------------------------
        | Dogs API Routes
        |--------------------------------------------------------------------------
        */
        Route.get('my-dogs','Api/DogController.myDogs')
        Route.resource('dogs','Api/DogController')

        /*
        |--------------------------------------------------------------------------
        | Blocked Users API Routes
        |--------------------------------------------------------------------------
        */
        Route.get('blocked-users','Api/BlockedUserController.blockedUsers')
        Route.post('blocked-users','Api/BlockedUserController.blockOrUnblock')

        /*
        |--------------------------------------------------------------------------
        | Friends API Routes
        |--------------------------------------------------------------------------
        */
        Route.get('friends/all','Api/FriendController.all')
        Route.resource('friends','Api/FriendController').only(['index','store','destroy'])

        /*
        |--------------------------------------------------------------------------
        | Parks API Routes
        |--------------------------------------------------------------------------
        */
        Route.get('my-parks','Api/ParkController.myParks')
        Route.group(() =>{
            Route.post('parks/:id/join','Api/ParkController.join')
            Route.resource('parks','Api/ParkController')
        }).middleware('premium')

    }).middleware('auth')

}).prefix('/api')
/*API-Subscription*/
Route.resource('subscriptions','Api/SubscriptionController')