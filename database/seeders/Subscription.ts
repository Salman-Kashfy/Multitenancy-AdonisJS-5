import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Subscription from 'App/Models/Subscription'

export default class SubscriptionSeeder extends BaseSeeder {
    public async run() {
        await Subscription.createMany([
            {
                id: Subscription.FREE_PLAN,
                name: 'Free Plan',
                amount: 0
            },
        ])
    }
}
