import { column, computed } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import myHelpers from "App/Helpers";

export default class Attachment extends CommonModel {

    static MIME_TYPE = {
        VIDEO:'video',
        IMAGE:'image',
    }

    static TYPE = {
        BUSINESS: 10,
        DOG: 20,
        PARK: 30,
        POST: 40
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

    @computed()
    public get mediaUrl() {
        return myHelpers.imageWithBaseURLOrNotFound(this.path)
    }

}
