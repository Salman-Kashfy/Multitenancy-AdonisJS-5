import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";

export default class Attachment extends CommonModel {

    static TYPE = {
        USER: 10,
        BUSINESS: 20
    }

    @column({isPrimary: true})
    public id: number

    @column()
    public path: string

    @column()
    public instanceType: number

    @column()
    public instanceId: number

    @column()
    public mimeType: string

    @column()
    public duration: string

    @column()
    public thumbnail: string

}
