import {beforeSave,column,manyToMany,ManyToMany} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import CommonModel from 'App/Models/CommonModel'
import Role from 'App/Models/Role'
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
    public phone: string

    @column()
    public countryCode: string

    @column()
    public phoneCode: string

    @column({ serializeAs: null })
    public password: string

    @column()
    public kycDoc: string

    @column()
    public latitude: number

    @column()
    public longitude: number

    @column()
    public maritalStatus: number

    @column()
    public buzzerCode: number

    @column()
    public streetAddress: string

    @column()
    public unitNumber: string

    @column()
    public country: string

    @column()
    public state: string

    @column()
    public city: string

    @column()
    public zip: string

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
    public referralCode: string

    @column()
    public referralCredit: number

    @column()
    public pushNotify: number

    @column()
    public otpCode: number

    @column.date()
    public otpExpiry: DateTime

    @column()
    public emailVerified: boolean

    @column.date()
    public dob: DateTime

    @column()
    public isSocialLogin: number

    @column()
    public accountDeactivated: boolean

    @beforeSave()
    public static async hashPassword(user: User) {
        if (user.$dirty.password) {
            user.password = await Hash.make(user.password)
        }
    }

    @manyToMany(() => Role,{
        pivotTable: 'user_roles'
    })
    public roles: ManyToMany<typeof Role>
}
