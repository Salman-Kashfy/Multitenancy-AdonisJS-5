export default interface OtpInterface {
    userId: number,
    type: string,
    email?: string,
    phone?:string,
    code?:number,
}