/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import myHelpers from 'App/Helpers'
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";

export default class ExceptionHandler extends HttpExceptionHandler {
    protected statusPages = {
        '404': 'errors.not-found',
        '500..599': 'errors.server-error',
    }


    /*
    * The default report method will report all the exceptions reaching the global exception handler. Getting notified about every exception can get annoying, specially, when there is no need to act on them. For this very same reason, the base exception handler allows you to blacklist the error codes or the status codes from being reported.
    * */

    /*protected ignoreStatuses = [
      400,
      422,
      401,
    ]*/

    constructor() {
        super(Logger)
    }

    // public async handle(error, ctx) {
    //     if (error.code === 'E_VALIDATION_FAILURE') {
    //         return ctx.response.status(422).send(error.messages)
    //     }
    //
    //     return super.handle(error, ctx)
    //
    // }

    public async handle(error, ctx: HttpContextContract) {
        /*DRY statements*/

        let response = ctx.response
        let errorBody = {src: error.status, message: error.stack}

        /*Common message*/
        let unauthorizedCodeMessage = "You must be authorized to complete this request!"

        /*******************************
         * Error Based on Text Code
         *******************************/
        let responseError, responseData
        switch (error.code) {

            /*validation failure*/
            case 'E_VALIDATION_FAILURE':
                responseError = Array.isArray(error.messages.errors) ? error.messages.errors[0].message : error.message
                responseData = error.messages.errors
                break


            /*Foreign Key Error*/
            case 'E_INVALID_AUTH_UID':
                responseError = "User not found!."
                break


            /*Foreign Key Error*/
            case 'ER_NO_REFERENCED_ROW_2':
                responseError = "Reference error: Invalid data provided."
                break

            case 'E_ROW_NOT_FOUND':
                responseError = 'The record you are looking for is not available, either it is deleted or never existed'
                break

            case 'E_INVALID_JWT_TOKEN':
                responseError = unauthorizedCodeMessage
                break

            case 'ER_DUP_ENTRY':
                responseError = error.sqlMessage
                break

            case "E_PASSWORD_MISMATCH":
                responseError = "Incorrect Password"
                break
            case "E_INVALID_AUTH_PASSWORD":
                responseError = "Incorrect Password"
                break

            case "E_USER_NOT_FOUND":
                responseError = "Record does not exist"
                break

            case "E_INVALID_JWT_REFRESH_TOKEN":
                responseError = "Invalid refresh token"
                break
        }

        if (responseError) {
            // @ts-ignore
            Logger.info(myHelpers.logMsg(errorBody))
            return response.status(error.status || 500).json({
                status: false,
                message: responseError,
                data: responseData || null
            })

        }

        /*******************************
         *Error Based on Code Number
         *******************************/

            //WEB BASED
            // switch (error.status) {
            //     case 401:
            //         response.redirect('/login', false, 301)
            //         break
            //     case 404:
            //         response.redirect('/404', false, 301)
            //         break
            //     case 403:
            //         response.redirect('/', false, 301)
            //         break;
            //     default:
            //         Logger.info(myHelpers.logMsg(errorBody))
            //         return response.status(error.status).json({status:false, message: responseError, data:{}})
            //
            // }
            //     return true

            //API BASED
        let errorMessage = error.message
        switch (error.status) {
            case 401:
                errorMessage = unauthorizedCodeMessage
                break
            case 404:
                errorMessage = "The requested URL is not found on this server"
                break
        }


        // @ts-ignore
        Logger.info(myHelpers.logMsg(errorBody))
        return response.status(error.status || 500).json({status: false, message: errorMessage, data: null})

    }
}
