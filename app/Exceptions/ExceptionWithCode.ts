import {Exception} from '@adonisjs/core/build/standalone'
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new ExceptionWithCodeException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class ExceptionWithCode extends Exception {
    message
    status

    constructor(message, status) {
        super(message, status);
        this.message = message
        this.status = status
    }

    public async handle(ctx: HttpContextContract) {
        ctx.response.status(this.status || 500).json({
            status: false,
            message: this.message,
            data: null
        })
    }
}
