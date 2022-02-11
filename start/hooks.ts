// const {hooks} = require('@adonisjs/ignitor')
//
// hooks.after.providersBooted(() => {
//     const Env = use('Env')
//     const edge = require('edge.js')
//     const moment = require('moment')
//     const fs = require('fs')
//     const HTMLDecoderEncoder = require('html-encoder-decoder')
//     const Config = use('Config')
//
//
//     /*base Url*/
//     edge.global('baseUrl', function (route = "") {
//         return Env.get('APP_URL') + '/' + route
//     })
//
//
//
//     /*Date Format*/
//     edge.global('dateFormat', function (date, format) {
//         return moment(date || new Date()).format(format)
//     })
//
//     /*Trophy images*/
//     edge.global('trophy', function (rank) {
//         rank = rank.toString()
//         switch (rank) {
//
//             case '1':
//                 return 'admin/images/first.jpg'
//             case '2':
//                 return 'admin/images/second.jpg'
//             case '3':
//                 return 'admin/images/third.jpg'
//         }
//     })
//
//
//     /*******************************
//      *Image Not found
//      *******************************/
//     edge.global('imageExist', function (imagePath, version = null, type = null) {
//         /*
//         * imagePath will be the path after public folder e.g: pic/
//         * fileName will be the name of file with any slash e.g mypic.png
//         * Version will be either medium or small
//         * Return file path if exist other with notfound image path will be returned
//         * */
//
//         let filepath,
//             notFound = type === 'user' ? Config.get('constants.notFoundUser') : Config.get('constants.notFound')
//
//         if (imagePath) {
//
//             if (version) {
//                 let fileArray = imagePath.split('/')
//                 let fileName = "", path = ""
//                 fileName = fileArray[fileArray.length - 1]
//                 let newName = version + '_' + fileName
//                 imagePath = imagePath.replace(fileName, newName)
//             }
//
//             /*Final output*/
//             if (!fs.existsSync('./public/' + imagePath)) {
//                 imagePath = notFound
//             }
//         } else {
//             imagePath = notFound
//         }
//         return imagePath
//     })
//
//
//     /****************************************
//      *HTML Decoder
//      ***************************************/
//     edge.global('htmlDecoder', function (content) {
//         return HTMLDecoderEncoder.decode(content)
//     })
//
//
//     /*******************************
//      * ENV Variable in Edge
//      *******************************/
//     edge.global('env', function (varName) {
//         return Env.get(varName)
//     })
//
//     /*******************************
//      *Constants
//      *******************************/
//     edge.global('constant', function (name) {
//         if (!name) {
//             return
//         }
//         return Config.get('constants.' + name)
//     })
//
//     /*******************************
//      * Math.Floor function
//      *******************************/
//     edge.global('floor', function (v) {
//         return Math.floor(v)
//     })
//
//     /*******************************
//      *Null to N/A
//      *******************************/
//     edge.global('ntn', function (value, label) {
//         // return value || `<a href="${Env.get('APP_URL') + '/edit-profile'}">Add ${label}</a>`
//         return (value || value !== 'undefined') || label
//     })
//
//
//     /*******************************
//      *Ago Format
//      *******************************/
//     edge.global('timeAgo', function (date, format) {
//         return moment(date, format).fromNow()
//     })
//
//     edge.global('humanize', function (sec) {
//         /*Accept duration in milli seconds*/
//         let duration = moment.duration(sec * 1000)
//         return duration.humanize()
//     })
//
//     edge.global('consoleLog', function (data) {
//         console.log(data)
//     })
//
// })