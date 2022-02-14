export default interface VerifyOtpInterface {
    email?: string,
    phone?:string,
    code:number,
    via:string,
    type:string,
}