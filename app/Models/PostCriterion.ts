import {column,belongsTo,BelongsTo} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import Subscription from "App/Models/Subscription";
import Role from "App/Models/Role";

export default class PostCriterion extends CommonModel {
    @column()
    public id: number
	@column()
	public roleId: number
	@column()
	public subscriptionId: number
	@column()
	public postsPerMonth: number
	@belongsTo(() => Subscription)
	public subscription: BelongsTo<typeof Subscription>
	@belongsTo(() => Role)
	public role: BelongsTo<typeof Role>
}
