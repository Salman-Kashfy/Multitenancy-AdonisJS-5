import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    /*
    |--------------------------------------------------------------------------
    | Admin Api Routes
    |--------------------------------------------------------------------------
    */
    Route.group(() => {
        Route.group(() => {
            Route.resource('sizes','Api/SizeController')
            Route.resource('genders','Api/GenderController')
            Route.resource('breeds','Api/BreedController')
            Route.resource('categories', 'Api/CategoryController')
            Route.get('roles','Api/RoleController.index')

            /*
            |--------------------------------------------------------------------------
            | User API Routes
            |--------------------------------------------------------------------------
            */
            Route.post('user', 'Api/UsersController.store')
            Route.put('user/admin-update/:id', 'Api/UsersController.adminUpdate')
            Route.get('user','Api/UsersController.index')
            Route.get('all-users','Api/UsersController.all')

            /*
            |--------------------------------------------------------------------------
            | Posts API Routes
            |--------------------------------------------------------------------------
            */
            Route.get('posts', 'Api/PostController.index')

            /*
            |--------------------------------------------------------------------------
            | Post Criteria API Routes
            |--------------------------------------------------------------------------
            */
            Route.resource('post-criteria','Api/PostCriterionController')

            /*
            |--------------------------------------------------------------------------
            | Badge and Criteria API Routes
            |--------------------------------------------------------------------------
            */
            Route.resource('badges','Api/BadgeController').except(['show'])
            Route.resource('badge-criteria','Api/BadgeCriterionController')

            /*
            |--------------------------------------------------------------------------
            | Notification API Routes
            |--------------------------------------------------------------------------
            */
            Route.post('notifications/custom-push', 'Api/NotificationController.customPush')

            /*
            |--------------------------------------------------------------------------
            | Settings API Routes
            |--------------------------------------------------------------------------
            */
            Route.put('settings', 'Api/SettingController.update')

            /*
            |--------------------------------------------------------------------------
            | Report API Routes
            |--------------------------------------------------------------------------
            */
            Route.get('reports', 'Api/ReportController.index')
            Route.get('reports/content-report', 'Api/ReportController.contentReport')
            Route.put('reports/content-report/:id', 'Api/ReportController.updateContentReport')
            Route.resource('reports', 'Api/ReportController').only(['update', 'destroy', 'show'])

            /*
            |--------------------------------------------------------------------------
            | Dashboard API Routes
            |--------------------------------------------------------------------------
            */
            Route.get('dashboard-data', 'Api/DashboardController.dashboardData')

        }).middleware('admin')
    }).middleware('auth')
}).prefix('/api')