import {
    beforeSave,
    column, computed,
    hasMany,
    HasMany, HasOne, hasOne,
    ManyToMany,
    manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Attachment from 'App/Models/Attachment'
import CommonModel from 'App/Models/CommonModel'
import Role from 'App/Models/Role'
import { DateTime } from 'luxon'
import Business from 'App/Models/Business'
import myHelpers from 'App/Helpers'

export default class User extends CommonModel {

    public static fillables = ['name','email','password','zip','image','push_notify']

    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public email: string

    @column()
    public username: string

    @column()
    public phone: string

    @column({ serializeAs: null })
    public password: string

    @column()
    public bio: string

    @column()
    public zip: string

    @column()
    public image: string

    @column()
    public pushNotify: number

    @column()
    public emailVerified: boolean

    @column.date()
    public dob: DateTime

    @column()
    public isSocialLogin: number

    @column()
    public is_blocked: number

    @beforeSave()
    public static async hashPassword(user: User) {
        if (user.$dirty.password) {
            user.password = await Hash.make(user.password)
        }
    }

    @hasOne(() => Attachment, {
        foreignKey: 'instanceId',
        onQuery: query => query.where({ instanceType: Attachment.TYPE.USER }).select('id','mimeType','path'),
    })
    public attachment: HasOne<typeof Attachment>

    @hasMany(() => Business)
    public business: HasMany<typeof Business>

    @manyToMany(() => Role,{
        pivotTable: 'user_roles'
    })
    public roles: ManyToMany<typeof Role>

    @computed()
    public get imagePath() {
        return myHelpers.userImageWithBaseURLOrNotFound(this.image)
    }

}
