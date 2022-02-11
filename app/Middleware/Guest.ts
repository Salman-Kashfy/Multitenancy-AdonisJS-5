import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class Guest {

    protected async authenticate(auth: HttpContextContract['auth'], guards: any[], response: any) {

        for (let guard of guards) {
            if (await auth.use(guard).check()) {
                return response.status(403).send({status: false, message: 'Permission denied.'})
            }
        }
        return true
    }

    public async handle({auth, response}: HttpContextContract, next: () => Promise<void>, customGuards: string[]) {
        // code for middleware goes here. ABOVE THE NEXT CALL
        const guards = customGuards.length ? customGuards : [auth.name];
        await this.authenticate(auth, guards, response);

        // const loggedIn = await auth.use(auth.name).check();
        // if(loggedIn){
        //     console.log(auth.user.name)
        // }

        await next()
    }
}
