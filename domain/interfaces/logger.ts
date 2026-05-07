export interface Logger {
    info(message: string, context?:any):void;
    error(message:string,error?:any):void;
    debug(message:string,data?:any):void;
}