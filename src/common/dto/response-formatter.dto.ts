import { ExecutionContext } from "@nestjs/common";
import { DEFAULT_RESPONSE_CODE, DEFAULT_RESPONSE_MESSAGE } from "../constants";

export class ResponseFormatterDto {
    statusCode?:number;
    message?:string;
    data?:any;

    constructor(context:ExecutionContext, data:any){
        let response: ResponseFormatterDto = {};

        response.statusCode=
          +context?.switchToHttp()?.getResponse()?.statusCode ||
          DEFAULT_RESPONSE_CODE;

        response.message = data?.message || data?.msg || DEFAULT_RESPONSE_MESSAGE;

        delete data['message'];
        delete data['msg'];
        delete data['statusCode'];

        response.data = data || {};

        return response;
    }
}