import Route from '@ioc:Adonis/Core/Route'

/****************************
 * Route Prefixed with api/v1
 *****************************/
Route.group(() => {

    /*
    |--------------------------------------------------------------------------
    | Authenticated API Routes
    |--------------------------------------------------------------------------
    */
    Route.group(() => {
        Route.get('me', 'Api/UsersController.me')
        Route.post('change-password', 'Api/UsersController.changePassword')

        /*
        |--------------------------------------------------------------------------
        | User API Routes
        |--------------------------------------------------------------------------
        */
        Route.get('users','Api/UsersController.index')
        Route.get('users/:id','Api/UsersController.show')
        Route.put('users/:id','Api/UsersController.update')

        /*
        |--------------------------------------------------------------------------
        | Categories API Routes
        |--------------------------------------------------------------------------
        */
        Route.resource('categories', 'Api/CategoryController').only(['index', 'show'])

        /*
        |--------------------------------------------------------------------------
        | Post API Routes (Activities/There/Here)
        |--------------------------------------------------------------------------
        */
        Route.get('posts', 'Api/PostController.index')
        Route.get('newsfeed', 'Api/PostController.newsfeed')

        /* Activity */
        Route.get('activity', 'Api/PostController.getActivity')
        Route.get('activity/count', 'Api/PostController.getActivityCount')
        Route.post('activity', 'Api/PostController.addActivity')
        Route.put('activity/:id', 'Api/PostController.editActivity')
        Route.delete('posts/:id', 'Api/PostController.destroy')

        /* There */
        Route.get('there', 'Api/PostController.there')
        Route.post('there', 'Api/PostController.addThere')
        Route.put('there/:id', 'Api/PostController.editThere')

        /* Check-In */
        Route.post('check-in', 'Api/PostController.addCheckIn')
        Route.put('check-in/:id', 'Api/PostController.editCheckIn')

        /*
        |--------------------------------------------------------------------------
        | Recent Places API Routes
        |--------------------------------------------------------------------------
        */
        Route.get('recent-places/all', 'Api/RecentPlaceController.all')
        Route.delete('recent-places/:id', 'Api/RecentPlaceController.destroy')

        /*
        |--------------------------------------------------------------------------
        | Level API Routes
        |--------------------------------------------------------------------------
        */
        Route.resource('levels', 'Api/LevelController').only(['index', 'show', 'update'])

        /*
        |--------------------------------------------------------------------------
        | Hashtags API Routes
        |--------------------------------------------------------------------------
        */
        Route.resource('hashtags', 'Api/HashtagController')

        /*
        |--------------------------------------------------------------------------
        | Group API Routes
        |--------------------------------------------------------------------------
        */
        Route.resource('groups', 'Api/GroupController')
        Route.post('add-member', 'Api/GroupController.addMember')
        Route.post('remove-member', 'Api/GroupController.removeMember')
        Route.get('get-members', 'Api/GroupController.getMembers')

        /*
        |--------------------------------------------------------------------------
        | Like API Routes
        |--------------------------------------------------------------------------
        */
        Route.resource('likes', 'Api/LikeController')

        /*
        |--------------------------------------------------------------------------
        | Comments API Routes
        |--------------------------------------------------------------------------
        */
        Route.resource('comments', 'Api/CommentController')

        /*
        |--------------------------------------------------------------------------
        | User Interests API Routes
        |--------------------------------------------------------------------------
        */
        Route.resource('user-interests', 'Api/UserInterestController')

        /*
        |--------------------------------------------------------------------------
        | Favourites API Routes
        |--------------------------------------------------------------------------
        */
        Route.resource('user-favourites', 'Api/UserFavouriteController')

        /*
        |--------------------------------------------------------------------------
        | Friends API Routes
        |--------------------------------------------------------------------------
        */
        Route.put('assign-level', 'Api/FriendController.assignLevel')
        Route.resource('friends', 'Api/FriendController')

        /*
        |--------------------------------------------------------------------------
        | Notifications API Routes
        |--------------------------------------------------------------------------
        */
        Route.post('notifications/mark-all-read', 'Api/NotificationController.markAllRead')
        Route.resource('notifications', 'Api/NotificationController')

        /*
        |--------------------------------------------------------------------------
        | Blocked Users API Routes
        |--------------------------------------------------------------------------
        */
        Route.resource('blocked-users', 'Api/BlockedUserController')

        /*
        |--------------------------------------------------------------------------
        | Report API Routes
        |--------------------------------------------------------------------------
        */
        Route.resource('report-types', 'Api/ReportTypeController')
        Route.resource('reports', 'Api/ReportController')

        /*
        |--------------------------------------------------------------------------
        | Pages API Routes
        |--------------------------------------------------------------------------
        */
        Route.resource('pages', 'Api/PageController').only(['store', 'update', 'destroy'])

    }).middleware(['auth', 'user'])

    /*
    |--------------------------------------------------------------------------
    | Guest API Routes
    |--------------------------------------------------------------------------
    */
    Route.post('login', 'Api/UsersController.login')
    Route.post('register', 'Api/UsersController.register')
    Route.post('forgot-password', 'Api/UsersController.forgotPassword')
    Route.post('resend-otp', 'Api/UsersController.resendOTP')
    Route.post('verify-otp', 'Api/UsersController.verifyOTP')
    Route.post('reset-password', 'Api/UsersController.resetPassword')
    Route.post('social-login', 'Api/UsersController.socialLogin')
    Route.resource('pages', 'Api/PageController').only(['index', 'show'])
    Route.get('get-page/:slug', 'Api/PageController.getPage')
    Route.post('/logout', 'Api/UsersController.logout')

    /*
    |--------------------------------------------------------------------------
    | Settings API Routes
    |--------------------------------------------------------------------------
    */
    Route.resource('settings', 'Api/SettingController').only(['index'])

}).prefix('/api/v1')