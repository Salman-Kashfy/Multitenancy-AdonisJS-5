import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from "App/Models/User";

export default class UserSeeder extends BaseSeeder {
    public async run () {
        await User.createMany([
            {
                id: User.PREDEFINED_USERS.ADMIN,
                name: 'admin',
                email: 'admin@doodle.com',
                username: 'admin',
                password: 'qwerty',
                emailVerified: true,
            }
        ])
    }
}
