import {args, BaseCommand, flags} from '@adonisjs/core/build/standalone'
//@ts-ignore
import * as os from "os";

export default class CreateModule extends BaseCommand {

    /**
     * Command name is used to run the command
     */
    public static commandName = 'module'

    /**
     * Command description is displayed in the "help" output
     */
    public static description = `This command will create Controller, Repository, Model, Validator, Route. To create ready-made CRUD operation of this newly created module`

    public static settings = {
        /**
         * Set the following value to true, if you want to load the application
         * before running the command
         */
        loadApp: true,

        /**
         * Set the following value to true, if you want this command to keep running until
         * you manually decide to exit the process
         */
        stayAlive: false,
    }

    /*
    * Arguments and flags (Position is important)
    * */
    @args.string({description: 'Name of the module'})
    public module: string

    @flags.string({alias: 't', description: 'Table of database'})
    public table: string

    @flags.boolean({alias: 'r', description: 'Rollback module'})
    public rollback: boolean

    /*NOTE: MAKE SURE TO RUN node ace generate:manifest*/


    public async run() {

        let Exec: any = (await import('../module-generator/exec')).default
        try {
            let password = await this.prompt.secure("Enter password")
            if (!password) return 'Password is required!'

            await Exec.set()
            //@ts-ignore
            let DC: any = (await import('../module-generator/DynamicContent')).default
            await DC.trespas(password)
            let {string} = await import('@ioc:Adonis/Core/Helpers')
            if (this.rollback) {
                /*
                * Delete file
                * Move to Recycle bin
                * */

                let capClass = string.pascalCase(this.module)
                let files_to_be_deleted = [
                    `app/Repos/${capClass}Repo.ts`,
                    `app/Controllers/Http/Api/${capClass}Controller.ts`,
                    `app/Models/${capClass}.ts`,
                    `app/Validators/${capClass}Validator.ts`,
                ]
                let sticker = this.ui.sticker()
                files_to_be_deleted.forEach((v, i) => {
                    sticker.add(this.colors.bold(i + 1 + '. ' + v))
                })
                sticker.render()

                let ask_delete = await this.prompt.toggle(this.colors.cyan("All above files will be deleted. Are you sure? (y/n)"), ["Yes", "No"])

                if (ask_delete) {
                    let deleteFiles = await DC.deleteFiles(files_to_be_deleted)
                    if (deleteFiles.status) {
                        this.ui.instructions().add(this.colors.green(`Files Deleted, ${this.colors.yellow('You should remove routes manually')}`)).render()
                    } else {
                        this.ui.instructions().add(this.colors.red(deleteFiles.message)).render()
                    }
                }
            } else {

                /*
                * Create module files
                * */

                const spinner = this.logger.await(
                    "Creating module files"
                )

                /*Nothing else just SHASHKA*/
                await new Promise((resolve) => {
                    setTimeout(function () {
                        spinner.stop()
                        resolve('Done')
                    }, 3000)
                })
                let sticker = this.ui.sticker()

                let controllerContent = await DC.controller(this.module)
                controllerContent.status ? sticker.add(this.colors.green(controllerContent.message)) : sticker.add(this.colors.red(controllerContent.message))
                let validatorContent = await DC.validator(this.module, this.table)
                validatorContent.status ? sticker.add(this.colors.green(validatorContent.message)) : sticker.add(this.colors.red(validatorContent.message))
                let repositoryContent = await DC.repository(this.module)
                repositoryContent.status ? sticker.add(this.colors.green(repositoryContent.message)) : sticker.add(this.colors.red(repositoryContent.message))
                let modelContent = await DC.model(this.module, this.table)
                modelContent.status ? sticker.add(this.colors.green(modelContent.message)) : sticker.add(this.colors.red(modelContent.message))
                let routes = await DC.createRoute(this.module)
                routes.status ? sticker.add(this.colors.green(routes.message)) : sticker.add(this.colors.red(routes.message))
                sticker.render()

                this.ui.instructions().add(this.colors.cyan(`Note: Move route in your desired location/group`)).render()

            }
        } catch (e) {
            console.log(e.message)
        } finally {
            await Exec.f()
        }

    }
}
