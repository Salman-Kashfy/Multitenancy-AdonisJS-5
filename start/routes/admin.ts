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
        }).middleware('admin')
    }).middleware('auth')

}).prefix('/api')
/*API-Size*/