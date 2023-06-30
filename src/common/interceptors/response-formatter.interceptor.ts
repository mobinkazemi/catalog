import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DEFAULT_RESPONSE_CODE, DEFAULT_RESPONSE_MESSAGE } from '../constants';
import { ResponseFormatterDto } from '../dto/response-formatter.dto';

@Injectable()
export class ResponseFormatterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
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
      }),
    );
  }
}
