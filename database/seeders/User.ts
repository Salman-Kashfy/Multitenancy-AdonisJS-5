import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from "App/Models/User";
import Env from "@ioc:Adonis/Core/Env"

export default class UserSeeder extends BaseSeeder {
    public static developmentOnly = true
    public async run () {
        await User.createMany([
            {
                id: 1,
                fName: 'admin',
                email: 'admin@doodle.com',
                password: 'qwerty',
                emailVerified: true,
            }
        ],{
            connection: Env.get('LANDLORD_MYSQL_DB_NAME')
        })
    }
}
