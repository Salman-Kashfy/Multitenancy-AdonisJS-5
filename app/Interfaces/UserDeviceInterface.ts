export enum DeviceTypes {
    ios='ios',
    android='android'
}

export default interface OtpInterface {
    userId: string,
    deviceType: string,
    deviceToken: string,
}