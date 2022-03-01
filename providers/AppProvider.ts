import { ApplicationContract } from '@ioc:Adonis/Core/Application'

declare module '@ioc:Adonis/Lucid/Orm' {
  interface ModelQueryBuilderContract<
      Model extends LucidModel,
      Result = InstanceType<Model>
      > {
    getCount(param): Promise<BigInt>
  }
}

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    const { ModelQueryBuilder } = this.app.container.use('Adonis/Lucid/Database')
    ModelQueryBuilder.macro('getCount', async function (param) {
      const result = await this.count(param)
      return result[0].$extras.count
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
