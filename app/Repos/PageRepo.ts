import BaseRepo from 'App/Repos/BaseRepo'
import Page from "App/Models/Page";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import constants from "Config/constants";
import {RequestContract} from "@ioc:Adonis/Core/Request";
import {string} from '@ioc:Adonis/Core/Helpers'


class PageRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    super(Page, relations)
    this.model = Page
  }

  //@ts-ignore
  async index(orderByColumn: string = constants.ORDER_BY_COLUMN, orderByValue: string = constants.ORDER_BY_VALUE, page: number = 1, perPage: number = constants.PER_PAGE, ctx: HttpContextContract) {
    let query = this.model.query().orderBy(orderByColumn, orderByValue)
    return await query
  }

  async update(id: number, input, request?: RequestContract, instanceType?: number, mediaType?: String) {
    let row = await this.model.findOrFail(id)
    if (request && request.file('media') && instanceType) {
      this.uploadMedia(request, row.id, instanceType, mediaType)
    }
    if (input.title) {
      input.slug = string.dashCase(input.title)
    }
    await row.merge(input).save()
    return await this.model.findOrFail(id)
  }
}

export default new PageRepo()
