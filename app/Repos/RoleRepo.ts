import BaseRepo from 'App/Repos/BaseRepo'
import Role from "App/Models/Role";


class RoleRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Role, relations)
        this.model = Role
    }
}

export default new RoleRepo()