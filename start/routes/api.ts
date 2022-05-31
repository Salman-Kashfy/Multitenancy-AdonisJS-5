import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    /*
    |--------------------------------------------------------------------------
    | Open Api Routes
    |--------------------------------------------------------------------------
    */
    Route.get('test', 'Api/PostsController.test');

    /*
    |--------------------------------------------------------------------------
    | Authenticated Api Routes
    |--------------------------------------------------------------------------
    */
    Route.group(() => {

    }).middleware('auth')
}).middleware('switchTenant').prefix('/api')