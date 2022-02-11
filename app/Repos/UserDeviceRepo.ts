import BaseRepo from 'App/Repos/BaseRepo'
import UserDevice from "App/Models/UserDevice";
import UserDeviceInterface from 'App/Interfaces/UserDeviceInterface'

class UserDeviceRepo extends BaseRepo{
    public model
    constructor() {
        const relations = []
        super(UserDevice, relations)
        this.model = UserDevice
    }

    async updateOrCreate(userDevice:UserDeviceInterface){
        return await this.model.updateOrCreate(userDevice,userDevice)
    }

}
export default new UserDeviceRepo()