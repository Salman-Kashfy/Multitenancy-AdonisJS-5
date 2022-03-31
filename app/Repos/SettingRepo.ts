import BaseRepo from 'App/Repos/BaseRepo'
import Setting from "App/Models/Setting";
import {RequestContract} from "@ioc:Adonis/Core/Request";

class SettingRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        super(Setting, relations)
        this.model = Setting
    }

    async store(input, request?: RequestContract, instanceType?: number, mediaType?: String): Promise<void> {
        let row = await this.model.create(input)
        if (request && request.file('media') && instanceType) {
            this.uploadMedia(request, row.id, instanceType, mediaType)
        }
        return row
    }

    async update(input){
        let settings = await this.model.query().first()
        if(!settings){
            return this.model.create(input)
        }
        return super.update(settings.id,input)
    }
}

export default new SettingRepo()
