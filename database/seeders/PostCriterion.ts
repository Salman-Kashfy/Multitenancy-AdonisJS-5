import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PostCriterion from 'App/Models/PostCriterion'
import Role from 'App/Models/Role'
import Subscription from 'App/Models/Subscription'

export default class PostCriterionSeeder extends BaseSeeder {
    public async run() {
        await PostCriterion.createMany([
            {
                id: 1,
                roleId: Role.PARENT,
                subscriptionId: Subscription.FREE_PLAN,
                postsPerMonth: 20
            },
            {
                id: 2,
                roleId: Role.BUSINESS,
                subscriptionId: Subscription.FREE_PLAN,
                postsPerMonth: 1
            }
        ])
    }
}
