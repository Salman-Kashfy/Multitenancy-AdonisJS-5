import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from "App/Models/Role";

export default class RoleSeeder extends BaseSeeder {
    public async run () {
        await Role.createMany([
            {
                id: Role.ADMIN,
                name: 'admin',
                display_name: 'Admin'
            },
            {
                id: Role.PARENT,
                name: 'parent',
                display_name: 'Parent'
            },
            {
                id: Role.BUSINESS,
                name: 'business',
                display_name: 'Business'
            }
        ])
    }
}
