import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'
import UserRole from 'App/Models/UserRole'
import Env from "@ioc:Adonis/Core/Env"

export default class UserRoleSeeder extends BaseSeeder {
    public static developmentOnly = true
    public async run() {
        await UserRole.createMany([
            {
                userId: 1,
                roleId: Role.SUPER_ADMIN,
            },
        ],{
            connection: Env.get('LANDLORD_MYSQL_DB_NAME')
        })
    }
}
