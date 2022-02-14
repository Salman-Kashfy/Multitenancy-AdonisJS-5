export enum DeviceTypes {
    ios='ios',
    android='android'
}

export default interface UserDeviceInterface {
    userId: string,
    deviceType: string,
    deviceToken: string,
}