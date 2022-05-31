import {beforeSave,column} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import CommonModel from 'App/Models/CommonModel'
import { DateTime } from 'luxon'

export default class User extends CommonModel {

    @column({ isPrimary: true })
    public id: number

    @column()
    public fName: string

    @column()
    public lName: string

    @column()
    public email: string

    @column()
    public username: string

    @column()
    public phone: string

    @column()
    public countryCode: string

    @column({ serializeAs: null })
    public password: string

    @column()
    public bio: string

    @column()
    public zip: string

    @column()
    public latitude: number

    @column()
    public longitude: number

    @column()
    public maritalStatus: number

    @column()
    public gender: number

    @column()
    public identification: number

    @column()
    public profession: string

    @column()
    public school: string

    @column()
    public privacy: number

    @column()
    public image: string

    @column()
    public profilePicture: string

    @column()
    public pushNotify: number

    @column()
    public emailVerified: boolean

    @column.date()
    public dob: DateTime

    @column()
    public isSocialLogin: number

    @column()
    public isBlocked: number

    @beforeSave()
    public static async hashPassword(user: User) {
        if (user.$dirty.password) {
            user.password = await Hash.make(user.password)
        }
    }
}
