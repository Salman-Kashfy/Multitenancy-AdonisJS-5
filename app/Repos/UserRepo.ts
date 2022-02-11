import BaseRepo from 'App/Repos/BaseRepo'
import User from "App/Models/User";

class UserRepo extends BaseRepo {
    model

    constructor() {
        const relations = ['attachments']
        super(User, relations)
        this.model = User
    }
}

/*Create a singleton instance*/
export default new UserRepo()
