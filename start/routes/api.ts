import Route from '@ioc:Adonis/Core/Route'

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
        Route.post('logout', 'Api/AuthController.logout')
        Route.get('user/suggested-friends', 'Api/UsersController.suggestedFriends')
        Route.get('user/:id', 'Api/UsersController.show')
        Route.put('user/update-parent-profile', 'Api/UsersController.updateParentProfile').middleware('parent')
        Route.put('user/update-business-profile', 'Api/UsersController.updateBusinessProfile').middleware('business')
        Route.put('change-password', 'Api/UsersController.changePassword')
        Route.post('user/get-users-by-phone', 'Api/UsersController.getUsersByPhone')
        Route.post('user/invite', 'Api/UsersController.invite')
        Route.post('user/check-username', 'Api/UsersController.checkUsername')
        Route.post('user/check-business-name', 'Api/UsersController.checkBusinessName')

        /*
        |--------------------------------------------------------------------------
        | Static Data API Routes
        |--------------------------------------------------------------------------
        */
        Route.get('sizes/all', 'Api/SizeController.all')
        Route.get('genders/all', 'Api/GenderController.all')
        Route.get('breeds/all', 'Api/BreedController.all')
        Route.get('categories/all', 'Api/CategoryController.all')

        /*
        |--------------------------------------------------------------------------
        | Dogs API Routes
        |--------------------------------------------------------------------------
        */
        Route.get('my-dogs', 'Api/DogController.myDogs')
        Route.resource('dogs', 'Api/DogController')

        /*
        |--------------------------------------------------------------------------
        | Blocked Users API Routes
        |--------------------------------------------------------------------------
        */
        Route.get('blocked-users', 'Api/BlockedUserController.blockedUsers')
        Route.post('blocked-users', 'Api/BlockedUserController.blockOrUnblock')

        /*
        |--------------------------------------------------------------------------
        | Friends API Routes
        |--------------------------------------------------------------------------
        */
        Route.get('friends/all', 'Api/FriendController.all')
        Route.resource('friends', 'Api/FriendController').only(['index', 'store', 'destroy'])

        /*
        |--------------------------------------------------------------------------
        | Parks API Routes
        |--------------------------------------------------------------------------
        */
        Route.get('host-parks', 'Api/ParkController.hostParks')
        Route.get('my-parks', 'Api/ParkController.myParks')
        Route.post('parks/join', 'Api/ParkController.join')
        Route.delete('parks/unjoin', 'Api/ParkController.unjoin')
        Route.post('parks/accept-decline-request', 'Api/ParkController.acceptDeclineRequest')
        Route.group(() => {
            Route.post('parks', 'Api/ParkController.store')
            Route.put('parks/:id', 'Api/ParkController.update')
            Route.delete('parks/:id', 'Api/ParkController.destroy')
        }).middleware('premium')
        Route.get('parks', 'Api/ParkController.index')
        Route.get('parks/:id', 'Api/ParkController.show')
        Route.get('park-requests', 'Api/ParkRequestController.index')

        /*
        |--------------------------------------------------------------------------
        | Parks Blocked Members API Routes
        |--------------------------------------------------------------------------
        */
        Route.post('park-block-user', 'Api/ParkController.block')
        Route.get('park-blocked-users/:id', 'Api/ParkBlockedUserController.index')

        /*
        |--------------------------------------------------------------------------
        | Park Members API Routes
        |--------------------------------------------------------------------------
        */
        Route.get('park-members/:id', 'Api/ParkMemberController.index')

        /*
        |--------------------------------------------------------------------------
        | Post API Routes
        |--------------------------------------------------------------------------
        */
        Route.post('posts', 'Api/PostController.createPost')
        Route.put('posts/:id', 'Api/PostController.updatePost')
        Route.delete('posts/:id', 'Api/PostController.destroy')
        Route.get('posts/park-quota/:parkId', 'Api/PostController.parkQuota')
        Route.post('posts/share/:id', 'Api/PostController.sharePost')
        Route.get('posts/share/:id', 'Api/PostController.getShareList')

        /*
        |--------------------------------------------------------------------------
        | Alert API Routes
        |--------------------------------------------------------------------------
        */
        Route.post('alerts', 'Api/PostController.createAlert')
        Route.put('alerts/:id', 'Api/PostController.updateAlert')

        /*
        |--------------------------------------------------------------------------
        | Post Criteria API Routes
        |--------------------------------------------------------------------------
        */
        Route.group(() => {
            Route.resource('post-criteria', 'Api/PostCriterionController')
        }).middleware('admin')

        /*
        |--------------------------------------------------------------------------
        | Comment API Routes
        |--------------------------------------------------------------------------
        */
        Route.resource('comments', 'Api/CommentController')

        /*
        |--------------------------------------------------------------------------
        | Like API Routes
        |--------------------------------------------------------------------------
        */
        Route.post('likes/count-likes','Api/LikeController.countLikes')
        Route.resource('likes','Api/LikeController').only(['index', 'store'])

    }).middleware('auth')

}).prefix('/api')