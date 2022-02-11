// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import constants from 'Config/constants'
import {LucidModel} from '@ioc:Adonis/Lucid/Orm'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import myHelpers from 'App/Helpers'
import Logger from '@ioc:Adonis/Core/Logger'
import Attachment from 'App/Models/Attachment'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class BaseRepo {
    model
    relations

    constructor(model: LucidModel, relations) {
        this.model = model
        this.relations = relations
    }

    async index(
        orderByColumn = constants.ORDER_BY_COLUMN,
        orderByValue = constants.ORDER_BY_VALUE,
        page = 1,
        perPage = constants.PER_PAGE,
        // @ts-ignore
        ctx: HttpContextContract
    ) {
        let query = this.model.query().orderBy(orderByColumn, orderByValue)
        for (let relation of this.relations) await query.preload(relation)
        return await query.paginate(page, perPage)
    }

    async store(input, request ?: RequestContract, instanceType?: number, mediaType?: String) {

        /*
        * handling Single/Multiple File upload
        * NOTE: "media" key will be used to input file(s) and store in attachments table
        * NOTE: Media Type -> use for validation, need to mention mediaType in arguments [image, video, ....]
        * */

        let row = await this.model.create(input)
        if (request && request.file('media') && instanceType) {
            this.uploadMedia(request, row.id, instanceType, mediaType)
        }
        return row
    }

    async show(id) {
        let row = await this.model.findOrFail(id)
        for (let relation of this.relations) await row.load(relation)
        return row
    }

    async delete(id) {
        let row = await this.model.findOrFail(id)
        await row.delete()
    }

    async update(id: number, input, request ?: RequestContract, instanceType?: number, mediaType?: String) {
        let row = await this.model.findOrFail(id)

        /*
        * handling Single/Multiple File upload
        * NOTE: "media" key will be used to input file(s) and store in attachments table
        * NOTE: Media Type -> use for validation, need to mention mediaType in arguments [image, video, ....]
        * */
        if (request && request.file('media') && instanceType) {
            this.uploadMedia(request, row.id, instanceType, mediaType)
        }
        await row.merge(input).save()
        return await this.model.findOrFail(id)
    }

    async uploadMedia(request: RequestContract, instanceId: number, instanceType: number, type ?: String) {
        let pendingPromises = []
        let files: any = request.files('media')

        if (files.length <= 0)
            throw new Error('Media has no file, make sure to send it as an array!')

        /*
        * Media custom validation
        * */
        for (let file of files) {
            if (type && file.type != type)
                throw new Error(`Only ${type} is allowed`)

            // @ts-ignore
            pendingPromises.push(myHelpers.uploadFile(file, 'posts/'))
        }

        let uploadedFiles: any = await Promise.all(pendingPromises)

        for (let uploadedFile of uploadedFiles) {

            await Attachment.create({
                instanceType: instanceType,
                instanceId: instanceId,
                mimeType: uploadedFile.type,
                path: uploadedFile.path,
                duration: uploadedFile.duration,
                thumbnail: uploadedFile.thumbnail,
            })
        }

        // @ts-ignore
        Logger.info(myHelpers.logMsg(`Attachments Uploaded successfully!`))
    }

    fillables() {
        return Object.values(this.model.$keys.attributesToColumns.keys)
    }

    async findByEmail(email) {
        return this.model.query().where({email}).first()
    }
}
