/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import {DatabaseConfig} from '@ioc:Adonis/Lucid/Database'

const databaseConfig: DatabaseConfig = {
    /*
    |--------------------------------------------------------------------------
    | Connection
    |--------------------------------------------------------------------------
    |
    | The primary connection for making database queries across the application
    | You can use any key from the `connections` object defined in this same
    | file.
    |
    */
    connection: Env.get('DB_CONNECTION'),

    connections: {
        /*
        |--------------------------------------------------------------------------
        | MySQL config
        |--------------------------------------------------------------------------
        |
        | Configuration for MySQL database. Make sure to install the driver
        | from npm when using this connection
        |
        | npm i mysql
        |
        */
        tenant: {
            client: 'mysql',
            connection: {
                host: Env.get('MYSQL_HOST'),
                port: Env.get('MYSQL_PORT'),
                user: Env.get('MYSQL_USER'),
                password: Env.get('MYSQL_PASSWORD', ''),
                database: '',
            },
            migrations: {
                naturalSort: true,
                paths: ['./database/migrations/tenant'],
                disableRollbacksInProduction: true,
            },
            healthCheck: true,
            debug: false,
            seeders: {
                paths: ['./database/seeders/MainSeeder']
            }
        },
        landlord: {
            client: 'mysql',
            connection: {
                host: Env.get('LANDLORD_MYSQL_HOST'),
                port: Env.get('LANDLORD_MYSQL_PORT'),
                user: Env.get('LANDLORD_MYSQL_USER'),
                password: Env.get('LANDLORD_MYSQL_PASSWORD', ''),
                database: Env.get('LANDLORD_MYSQL_DB_NAME'),
            },
            pool: {
                min: 1,
                max: 1,
            },
            migrations: {
                naturalSort: true,
                paths: ['./database/migrations/landlord'],
                disableRollbacksInProduction: true,
            },
            healthCheck: true,
            debug: false,
            seeders: {
                paths: ['./database/seeders/MainSeeder']
            }
        },

    },
}

export default databaseConfig
