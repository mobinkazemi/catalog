import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map, finalize, tap, every, filter } from 'rxjs/operators';
import { LogService } from 'src/log/log.service';
import { Log } from 'src/log/schema/log.schema';
import { ResponseFormatterDto } from '../dto/response-formatter.dto';
import { ExceptionNameToCode } from '../enums/exceptions.enum';

type insertLogType = Partial<
  Omit<
    Log,
    '_id' | 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'pid' | 'ord'
  >
>;

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    let logData: insertLogType = {
      method: request.method,
      payload: request?.user?.payload,
      requestData: getRequestData(request),
      url: request.url,
      // message
      // statusCode
      // responseData
    };

    return next.handle().pipe(
      tap((data: ResponseFormatterDto) => {
        logData.message = data?.message;
        logData.statusCode = data?.statusCode;
        this.logService.create(logData);
        return data;
      }),
      catchError((error: Error) => {
        logData.message = error?.message;

        // 500's reason is because when app crashes, error type is not kind of http exception
        logData.statusCode = ExceptionNameToCode[error?.name] || 500;

        if (logData.statusCode == 500) {
          logData.message = error.stack;
        }

        this.logService.create(logData);
        throw error;
      }),
    );
  }
}

function getRequestData(request: any) {
  let data = {
    ...request.body,
    ...request.params,
    ...request.query,
  };

  return data;
}
