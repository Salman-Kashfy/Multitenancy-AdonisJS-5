import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import Post from 'App/Models/Post'

export default class PostsController extends ApiBaseController{

    async test( { request }: HttpContextContract ){
        let posts = await Post.all()
        const data = {
            host:request.headers().host,
            posts:posts ? posts : '',
        }
        return this.apiResponse("Response Retrieved Successfully!",data)
    }
}
