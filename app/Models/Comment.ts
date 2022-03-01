import { column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";
import User from "App/Models/User";

export default class Comment extends CommonModel {

	static MENTION_TYPE = {
		COMMENT:10,
		POST:20,
	}

    @column()
    public id: number
	@column()
	public parentId: number
	@column()
	public userId: number
	@column()
	public postId: number
	@column()
	public comment: string

	@manyToMany(() => User, {
		pivotTable: 'mentions',
		localKey: 'id',
		pivotForeignKey: 'instance_id',
		relatedKey: 'id',
		pivotRelatedForeignKey: 'user_id',
		onQuery: query => query.where({ instance_type: Comment.MENTION_TYPE.COMMENT }),
	})
	public mentions: ManyToMany<typeof User>

}
