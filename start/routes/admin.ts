import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    /*
    |--------------------------------------------------------------------------
    | Admin Api Routes
    |--------------------------------------------------------------------------
    */
    Route.group(() => {
        Route.resource('sizes','Api/SizeController')
        Route.resource('genders','Api/GenderController')
        Route.resource('breeds','Api/BreedController')
    }).middleware('admin')

}).prefix('/api')
/*API-Size*/