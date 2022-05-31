# Multitenancy Adonis JS 5

## Overview
This boiler demonstrate implementation of multi-tenant approach. Each tenant will have its own database.

#### Database connections 
We will register two database connections in our database config file, namely landlord and tenant.
keeping landlord as default database which will be used by super-admin. 

#### Tenants
Tenants table resides in landlord database. All tenants entries will be stored here. The domain column in this table serves a vital role in switching database on every request.

#### Switching database LifeCycle
All HTTP requests that are tenant based needs to go through a global middleware called "SwitchTenant".
The middleware extracts the domain from header of the http request and use it to get tenant details from default database i.e landlord.
Details includes its database name. Now, we programmatically switch the database of tenant connection using database library.

**Note:** We keep a track record if the upcoming http requests are of the same domain. If yes, we donot change connection database. 
We only change connection if the upcoming request is different from the previous database. Ignoring this will result in severe performance issues or even failure of every http request.

#### Migrations for landlord
The migration files for landlord are pre-configured to be created in /migrations/landlord folder. This is done to maintain migrations for landlord and tenants separately.
Use the following command to create a migration for landlord:
```
node ace make:migration tenants --connection=landlord
```

Use command to migrate landlord: 
```
node ace migration:run --connection=landlord
```
#### Migrations for tenants
This boiler ships with a custom command to migrate database to every tenant stored in tenants table in landlord database.
We use default migrations directory for all our tenants.

**Note:** Make sure there are tenants stored in tenants table in landlord database before running tenants migration.

Use command to migrate all tenants.
```
node ace tenant:migrate
```
or, you can also migrate a single tenant using command:
```
node ace tenant:migrate <dbName>
```
where *dbName* is tenant's database

#### Rollback landlord and tenants
Rollback command for landlord are pretty standard. We just need to specify connection before running landlord migrations.
Use command to rollback landlord:
```
node ace migration:rollback --connection=landlord
```
Use command to rollback all tenant's databases:
```
node ace tenant:rollback
```
or, you can also rollback a single tenant using command:
```
node ace tenant:rollback <dbName>
```
where *dbName* is tenant's database
**Note:** It's recommended not to run rollbacks in production enviroment.

## Conclusion
The following solution is tested with benchmark testing and can handle thousands of concurrent requests from multple tenants at the same time.