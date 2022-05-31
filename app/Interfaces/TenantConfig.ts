export interface TenantConfig {
    client: string,
    connection: {
        host: string
        port: string
        user: string
        password: string
        database:string
    },
    pool: {
        min:number,
        max:number,
    }
}