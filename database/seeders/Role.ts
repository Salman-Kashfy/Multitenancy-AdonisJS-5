import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from "App/Models/Role";

export default class RoleSeeder extends BaseSeeder {
    public async run () {
        await Role.createMany([
            {
                id: Role.ADMIN,
                name: 'admin',
                displayName: 'Admin'
            },
            {
                id: Role.PARENT,
                name: 'parent',
                displayName: 'Parent'
            },
            {
                id: Role.BUSINESS,
                name: 'business',
                displayName: 'Business'
            }
        ])
    }
}
