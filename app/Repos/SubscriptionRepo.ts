import BaseRepo from 'App/Repos/BaseRepo'
import Subscription from "App/Models/Subscription";


class SubscriptionRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Subscription, relations)
        this.model = Subscription
    }
}

export default new SubscriptionRepo()