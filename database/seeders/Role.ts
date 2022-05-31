import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from "App/Models/Role";
import Env from '@ioc:Adonis/Core/Env'

export default class RoleSeeder extends BaseSeeder {
    public static developmentOnly = true
    public async run () {
        await Role.createMany([
            {
                id: Role.SUPER_ADMIN,
                name: 'super_admin',
                displayName: 'Super admin'
            },
            {
                id: Role.ADMIN,
                name: 'admin',
                displayName: 'Admin'
            },
            {
                id: Role.USER,
                name: 'user',
                displayName: 'User'
            }
        ], {
            connection: Env.get('LANDLORD_MYSQL_DB_NAME')
        })
    }
}
