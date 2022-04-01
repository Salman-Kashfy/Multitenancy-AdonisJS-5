import ApiBaseController from 'App/Controllers/Http/Api/ApiBaseController'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import PageRepo from "App/Repos/PageRepo";
import PageValidator from "App/Validators/PageValidator";
import Attachment from "App/Models/Attachment";
import {string} from '@ioc:Adonis/Core/Helpers'

export default class PageController extends ApiBaseController {

  constructor() {
    super(PageRepo)
  }

  async store(ctx: HttpContextContract, instanceType?: number, mediaType?: String) {
    await ctx.request.validate(PageValidator)
    let input = ctx.request.only(this.repo.fillables())
    input.slug = string.dashCase(input.title)
    let row = await PageRepo.store(input, ctx.request, instanceType || Attachment.TYPE[this.repo.model.name.toUpperCase()], mediaType)
    return this.apiResponse('Record Added Successfully', row)
  }

  async update(ctx: HttpContextContract, instanceType?: number, mediaType?: String): Promise<{ data: any; message: string; status: boolean }> {
    await ctx.request.validate(PageValidator)
    return super.update(ctx, instanceType, mediaType)
  }

  async getPage(ctx: HttpContextContract) {
    let slug = ctx.request.param('slug')
    let res = await PageRepo.model.query().where('slug', slug).first()
    return this.apiResponse('Page retrieved successfully!', res)
  }

}
