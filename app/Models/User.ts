import {
    beforeDelete,
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
import Badge from 'App/Models/Badge'
import Post from 'App/Models/Post'
import Dog from 'App/Models/Dog'
import ParkMember from 'App/Models/ParkMember'
import ParkRequest from 'App/Models/ParkRequest'
import Park from 'App/Models/Park'
import Report from 'App/Models/Report'

export default class User extends CommonModel {

    static PROFILE = {
        PUBLIC: 10,
        FRIENDS: 20,
        ONLY_ME: 30
    }

    public serializeExtras = true

    public static fillables = ['name','username','email','bio','phone','password','zip','privacy','image','push_notify']

    static PREDEFINED_USERS = {
        ADMIN:1
    }

    static MARITAL_STATUS = {
        SINGLE:10,
        MARRIED:20,
    }

    static GENDER = {
        MALE:10,
        FEMALE:20,
        OTHER:30,
    }

    static IDENTIFICATION = {
        STRAIGHT:10,
        GAY:20,
        OTHER:30,
    }

    public static distanceQuery = '( ? * acos ( cos ( radians( ? ) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians( ? ) ) + sin ( radians( ? ) ) * sin( radians( latitude ) ) ) ) AS distance'

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

    @manyToMany(() => Badge,{
        pivotTable: 'user_badges'
    })
    public badges: ManyToMany<typeof Badge>

    @hasMany(() => Friend)
    public myFriendsWithRequests: HasMany<typeof Friend>

    @hasMany(() => Post)
    public posts: HasMany<typeof Post>

    @hasMany(() => Dog)
    public dogs: HasMany<typeof Dog>

    @hasMany(() => ParkMember,{
        foreignKey:'memberId'
    })
    public parkMember: HasMany<typeof ParkMember>

    @hasMany(() => ParkRequest,{
        foreignKey:'memberId'
    })
    public parkRequests: HasMany<typeof ParkRequest>

    @hasMany(() => Park)
    public parks: HasMany<typeof Park>

    @hasMany(() => Report,{
        foreignKey: 'instanceId',
        onQuery: query => query.where('instance_type', Report.INSTANCE_TYPES.USER),
    })
    public reports: HasMany<typeof Report>

    @beforeDelete()
    public static async deleteUser(user: User) {
        await user.related('myFriendsWithRequests').query().update({'deleted_at': new Date()})
        await user.related('posts').query().update({'deleted_at': new Date()})
        await user.related('dogs').query().update({'deleted_at': new Date()})
        await user.related('parkMember').query().update({'deleted_at': new Date()})
        await user.related('parkRequests').query().update({'deleted_at': new Date()})
        await user.related('parks').query().update({'deleted_at': new Date()})
        await user.related('reports').query().update({'deleted_at': new Date()})
    }

    @computed()
    public get imagePath() {
        return myHelpers.userImageWithBaseURLOrNotFound(this.image)
    }

    @computed()
    public get profilePicturePath() {
        return myHelpers.userImageWithBaseURLOrNotFound(this.profilePicture)
    }

    @computed()
    public get maritalStatusText() {
        return this.maritalStatus ? (Object.keys(User.MARITAL_STATUS).find(key => User.MARITAL_STATUS[key] === this.maritalStatus)) : ''
    }

    @computed()
    public get genderText() {
        return this.gender ? (Object.keys(User.GENDER).find(key => User.GENDER[key] === this.gender)) : ''
    }

    @computed()
    public get identificationText() {
        return this.identification ? (Object.keys(User.IDENTIFICATION).find(key => User.IDENTIFICATION[key] === this.identification)) : ''
    }

}
