import { BaseCommand,args } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import Migrator from '@ioc:Adonis/Lucid/Migrator'
import Config from '@ioc:Adonis/Core/Config'

export default class TenantRollback extends BaseCommand {

    @args.string({required:false})
    public database: string

    public static commandName = 'tenant:rollback'
    public static description = 'Custom command to rollback database single or multiple tenants.'

    public static settings = {
        loadApp: true,
        stayAlive: false,
    }

    public async run() {
        const { default: TenantRepo } = await import('App/Repos/TenantRepo')
        if(this.database){
            const tenant = await TenantRepo.model.query().where('database',this.database).first()
            if(!tenant){
                this.logger.error(`No tenant found this database.`)
                return
            }
            /*
            * Migrate single tenant databases
            * */
            await this.migrate(tenant)
        }else{
            const tenants = await TenantRepo.model.query()
            if(!tenants || !tenants?.length){
                this.logger.info(`No tenants found. Please add tenants in landlord DB.`)
                return
            }
            /*
            * Migrate all tenant databases
            * */
            for (const [index,tenant] of tenants.entries()) {
                if(index) console.log('') // Line break
                await this.migrate(tenant)
            }
        }
    }

    /*
    * Migrate database for specified tenant
    * */
    private async migrate(tenant){
        await Database.manager.close('tenant')
        Config.set('database.connections.tenant.connection.database',tenant.database)
        await Database.manager.connect('tenant')
        const migrator = new Migrator(Database, Application, {
            direction: 'down',
            dryRun: false,
            connectionName: 'tenant',
        })
        await migrator.run()
        this.logger.info(`Rollback tenant #${tenant.id} (${tenant.database})`)
        for (const migratedFile in migrator.migratedFiles) {
            const status = migrator.migratedFiles[migratedFile].status === 'completed' ? 'rollback' : migrator.migratedFiles[migratedFile].status
            console.log('\x1b[33m%s\x1b[0m',`[${status}]`,migrator.migratedFiles[migratedFile].file.filename)
        }
    }
}
