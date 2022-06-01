import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import Post from 'App/Models/Post'

export default class PostsController extends ApiBaseController{

    async test(){
        let posts = await Post.all()
        return this.apiResponse("Response Retrieved Successfully!",posts)
    }
}
