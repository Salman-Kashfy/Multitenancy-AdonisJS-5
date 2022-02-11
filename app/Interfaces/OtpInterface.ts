export default interface OtpInterface {
    userId: string,
    type: string,
    email?: string,
    phone?:string,
    code?:number,
}