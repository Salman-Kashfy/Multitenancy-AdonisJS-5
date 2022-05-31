'use strict'

import Env from '@ioc:Adonis/Core/Env'
import constants from 'Config/constants'
import Logger from '@ioc:Adonis/Core/Logger'
import UserDevice from 'App/Models/UserDevice'
import Notification from 'App/Models/Notification'
import Application from "@ioc:Adonis/Core/Application";
import Database from "@ioc:Adonis/Lucid/Database"

const ImageResizer = require('node-image-resizer')
const FCM = require('fcm-node')
const fs = require('fs')
const AWS = require('aws-sdk')
const sharp = require('sharp')

export default {
    /*Log message*/
    logMsg(msg: any) {
        return {
            timestamp: new Date().getTime(),
            msg,
        }
    },
    async resizeImage(sourcePath, sourceImage, destinationPath = null) {
        destinationPath = destinationPath || sourceImage
        const setup = {
            all: {
                path: destinationPath,
                quality: 100,
            },
            versions: [
                {
                    prefix: 'medium_',
                    width: constants.IMAGE_RESIZE.MEDIUM,
                },
                {
                    quality: 100,
                    prefix: 'small_',
                    width: constants.IMAGE_RESIZE.SMALL,
                },
            ],
        }
        ImageResizer(sourcePath + sourceImage, setup)
    },
    async uploadFile(file, path): Promise<any> {
        let uploadChannel = constants.UPLOAD_CHANNEL
        switch (uploadChannel) {
            case 'local':
                return await this.uploadFileLocally(file, path)
            case 's3':
                return await this.uploadFileS3(file, path)
        }
    },
    async uploadFileLocally(file, dir): Promise<object> {
        let random_name = `${new Date().getTime() * Math.round(Math.random() * 1000)}.${file.extname}`
        let uploadPath = 'public/' + dir
        if (file.hasErrors) {
            throw new Error(file.errors[0].message)
        }
        await file.move('public', {
            name: dir + random_name,
            overwrite: true,
        })

        /*
         * Create Multiple Variants of Image
         * */
        if (file.type === 'image') {
            await this.resizeImage(uploadPath, random_name, uploadPath)
        }

        /*
         * Video Thumbnail and Duration
         * */
        let sourceFile = `./public/${file.fileName}`
        let videoProcessingOutput = await this.videoThumbnailAndDuration(file, sourceFile)

        return {
            path: file.fileName,
            duration: videoProcessingOutput.duration,
            thumbnail: videoProcessingOutput.thumbnail,
            type: file.type,
        }
    },
    async sendNotification(title = constants.APP_NAME, body = null, payload = {}, devices) {
        var serverKey = constants.FCM_KEY
        var fcm = await new FCM(serverKey)
        title = constants.APP_NAME
        let iosTokens = devices.flatMap((device) =>
            device.device_type === 'ios' ? device.device_token : []
        )
        let androidTokens = devices.flatMap((device) =>
            device.device_type === 'android' ? device.device_token : []
        )
        let webTokens = devices.flatMap((device) =>
            device.device_type === 'web' ? device.device_token : []
        )

        /*FOR ANDROID*/
        if (androidTokens.length > 0) {
            let message = {
                registration_ids: androidTokens,
                data: {
                    title: title,
                    body: body,
                    payload,
                    sound: 'default',
                },
                notification: {
                    title: title,
                    body: body,
                    sound: 'default',
                    payload,
                },
            }

            //message.data = {...message.data, ...payload}

            fcm.send(message, function (err, response) {
                if (err) {
                    Logger.error(err)
                } else {
                    Logger.info(response)
                }
            })
        }

        /*FOR IOS*/
        if (iosTokens.length > 0) {
            let message = {
                registration_ids: iosTokens,
                notification: {
                    title: title,
                    body: body,
                    sound: 'default',
                    payload,
                },
                data: {
                    title: title,
                    body: body,
                    payload,
                },
            }

            fcm.send(message, function (err, response) {
                if (err) {
                    Logger.error(err)
                } else {
                    Logger.info(response)
                }
            })
        }
        /* For Web */
        if (webTokens.length > 0) {
            let message = {
                registration_ids: webTokens,
                data: {
                    title: title,
                    body: body,
                    payload,
                    sound: 'default',
                },
                notification: {
                    title: title,
                    body: body,
                    sound: 'default',
                    payload,
                },
            }

            fcm.send(message, function (err, response) {
                if (err) {
                    Logger.error(err)
                } else {
                    Logger.info(response)
                }
            })
        }
    },
    async uploadFileS3(file, path) {
        /* INSTRUCTIONS */
        // - use env(S3_URL) for full url
        // for medium variation
        // let medium_image = image.split("/")
        // let path = medium_image[0] + '/medium_' + medium_image[1]
        /* END INSTRUCTIONS */

        let fileName = file.tmpPath
        let random_name = `${new Date().getTime() * Math.floor(Math.random() * 1000)}.${file.extname}`

        const s3 = await new AWS.S3({
            accessKeyId: Env.get('S3_KEY'),
            secretAccessKey: Env.get('S3_SECRET'),
        })
        // Read content from the file
        const fileContent = fs.readFileSync(fileName)

        // Setting up S3 upload parameters
        const params: any = {
            Bucket: Env.get('S3_BUCKET'),
            ACL: 'public-read',
        }
        await sharp(fileName)
            .resize(constants.IMAGE_RESIZE.MEDIUM)
            .toBuffer()
            .then(async (buffer) => {
                params.Body = buffer
                params.Key = path + 'medium_' + random_name
                s3.upload(params, (err, data) => {
                    err ? Logger.error(err) : Logger.info(data)
                })
            })
            .catch(function (err) {
                console.log('Got Error', err)
            })
        await sharp(fileName)
            .resize(constants.IMAGE_RESIZE.MEDIUM)
            .toBuffer()
            .then(async (buffer) => {
                params.Body = buffer
                params.Key = path + 'small_' + random_name
                s3.upload(params, (err, data) => {
                    err ? Logger.error(err) : Logger.info(data)
                })
            })
            .catch(function (err) {
                console.log('Got Error', err)
            })
        let response: any = await new Promise((resolve, reject) => {
            params.Key = path + random_name
            params.Body = fileContent
            s3.upload(params, (err) => {
                if (err) {
                    return reject({
                        error: true,
                        message: err,
                    })
                }
                return resolve({
                    success: true,
                    data: path + random_name,
                })
            })
        })

        return {
            path: response ? response.data : null,
            type: file.type,
        }
    },
    async deleteS3Object(path) {
        const s3 = await new AWS.S3({
            accessKeyId: Env.get('S3_KEY'),
            secretAccessKey: Env.get('S3_SECRET'),
        })
        var params = {
            Bucket: Env.get('S3_BUCKET'),
            Key: path,
        }
        s3.deleteObject(params, function (err: any, _data: any) {
            if (err) Logger.error(err)
        })
        // delete mediuim
        let medium_image = path.split('/')
        let medium_path = medium_image[0] + '/medium_' + medium_image[1]
        params.Key = medium_path
        s3.deleteObject(params, function (err: any, _data: any) {
            if (err) Logger.error(err)
        })
        // delete small
        let small_image = path.split('/')
        let small_path = small_image[0] + '/small_' + small_image[1]
        params.Key = small_path
        s3.deleteObject(params, function (err: any, _data: any) {
            if (err) Logger.error(err)
        })
    },
    getImageVersion(imagePath, version) {
        let fileArray = imagePath.split('/')
        let fileName = ''
        fileName = fileArray[fileArray.length - 1]
        let newName = version + '_' + fileName
        imagePath = imagePath.replace(fileName, newName)
        return this.imageWithBaseURLOrNotFound(imagePath)
    },
    imageWithBaseURLOrNotFound(newImage) {
        switch (constants.UPLOAD_CHANNEL) {
            case 'local':
                if (fs.existsSync(Application.makePath('public/') + newImage)) {
                    return Env.get('APP_URL') + newImage
                } else {
                    return Env.get('APP_URL') + constants.IMAGE_NOT_FOUND
                }
            case 's3':
                return newImage ? constants.S3_URL + newImage : constants.S3_URL + constants.IMAGE_NOT_FOUND
        }
    },
    userImageWithBaseURLOrNotFound(newImage) {
        switch (constants.UPLOAD_CHANNEL) {
            case 'local':
                if (fs.existsSync(Application.makePath('public/') + newImage)) {
                    return Env.get('APP_URL') + newImage
                } else {
                    return Env.get('APP_URL') + constants.IMAGE_NOT_FOUND
                }
            case 's3':
                if(newImage){
                    if(newImage.indexOf('http') === -1) {
                        return constants.S3_URL + newImage
                    }
                    return newImage
                }
                return constants.S3_URL + constants.USER_NOT_FOUND

        }
    },
    pluck(ArrayObj, column) {
        let array: any = []
        for (let i = 0; i < ArrayObj.length; i++) {
            array.push(ArrayObj[i][column])
        }
        return array
    },
    countPages(totalRecords, limit = constants.PER_PAGE) {
        let totalPages = totalRecords/limit
        return totalPages < 1 ? 0 : Math.ceil(totalPages)
    },
    formatPages(data,totalRecords,currentPage,perPage = constants.PER_PAGE) {
        const lastPage = this.countPages(totalRecords,perPage)
        return {
            meta :{
                total:totalRecords,
                per_page:perPage,
                current_page:currentPage,
                last_page:lastPage
            },
            data
        }
    },
    async sendNotificationStructure(user_id, ref_id, type, referenced_user_id, title = null, msg) {
        let notification: any;
        let payload: any;
        let devices = await UserDevice.query()
            .where('user_id', user_id)
            .whereHas('user', (query) => {
                query.where('push_notify', 1)
            })
        if (devices.length > 0) {
            payload = {
                notifiableId: user_id,
                refId: ref_id,
                type: type,
                referencedUserId: referenced_user_id,
                title: title ? title : constants.APP_NAME,
                message: msg
            }
            notification = await Notification.create(payload)
            payload.notification_id = notification.id
            this.sendNotification(constants.APP_NAME, msg, payload, devices)
        }
    },
    setTenantDB(database){
        Database.manager.patch('tenant', {
            client: 'mysql',
            connection: {
                host: Env.get('MYSQL_HOST'),
                port: Env.get('MYSQL_PORT'),
                user: Env.get('MYSQL_USER'),
                password: Env.get('MYSQL_PASSWORD', ''),
                database:database
            },
            pool: {
                min:1,
                max:1,
            }
        })
    }
}
