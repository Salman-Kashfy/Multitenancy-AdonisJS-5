import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";

export default class Setting extends CommonModel {
  @column()
  public id: number
  @column()
  public title: string
  @column()
  public about: string
  @column()
  public phone: string
  @column()
  public address: string
  @column()
  public appStoreLink: string
  @column()
  public facebookLink: string
  @column()
  public buildVersion: string
  @column()
  public baseUrl: string
  @column()
  public year: number
  @column()
  public salesTax: number
  @column()
  public commission: number
  @column()
  public penaltyCharges: number

}
