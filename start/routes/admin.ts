import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    /*
    |--------------------------------------------------------------------------
    | Admin Api Routes
    |--------------------------------------------------------------------------
    */
    Route.group(() => {

    }).middleware('auth')
}).prefix('/api')