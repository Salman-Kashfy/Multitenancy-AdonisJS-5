import BaseRepo from 'App/Repos/BaseRepo'
import Tenant from "App/Models/Tenant";
//import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"

class TenantRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Tenant, relations)
        this.model = Tenant
    }
}

export default new TenantRepo()
