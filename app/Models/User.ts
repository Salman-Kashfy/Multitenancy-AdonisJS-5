import {
    beforeSave,
    column, computed,
    hasMany,
    HasMany,
    ManyToMany,
    manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import CommonModel from 'App/Models/CommonModel'
import Role from 'App/Models/Role'
import { DateTime } from 'luxon'
import Business from 'App/Models/Business'
import myHelpers from 'App/Helpers'
import Friend from 'App/Models/Friend'
import Subscription from 'App/Models/Subscription'

export default class User extends CommonModel {
    public serializeExtras = true

    public static fillables = ['name','username','email','password','zip','image','push_notify']

    public static select(){
        return ['id','name','username','image']
    }

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

    @hasMany(() => Business)
    public business: HasMany<typeof Business>

    @manyToMany(() => Role,{
        pivotTable: 'user_roles'
    })
    public roles: ManyToMany<typeof Role>

    @manyToMany(() => Subscription,{
        pivotTable: 'user_subscriptions'
    })
    public subscription: ManyToMany<typeof Subscription>

    @hasMany(() => Friend, {
        foreignKey: 'friendId',
        onQuery: query => query.where('status', Friend.STATUSES.ACCEPTED),
    })
    public friends: HasMany<typeof Friend>

    @hasMany(() => Friend, {
        foreignKey: 'friendId',
        onQuery: query => query.where('status', Friend.STATUSES.REQUESTED),
    })
    public requested_friends: HasMany<typeof Friend>

    @computed()
    public get imagePath() {
        return myHelpers.userImageWithBaseURLOrNotFound(this.image)
    }

}
