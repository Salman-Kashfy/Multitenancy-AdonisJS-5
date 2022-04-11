import BaseRepo from 'App/Repos/BaseRepo'
import WebhookLog from "App/Models/WebhookLog";


class WebhookLogRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(WebhookLog, relations)
        this.model = WebhookLog
    }
}

export default new WebhookLogRepo()