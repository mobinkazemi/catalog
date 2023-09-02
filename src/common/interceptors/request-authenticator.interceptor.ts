import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LogService } from 'src/log/log.service';
import { RedisProxyService } from 'src/redis/redis.service';
import { RouteAuthRedisKeyMaker } from '../functions/get-route-redis-key.function';

type RedisValueType = { roles: Array<string>; isPublic?: boolean };
const whiteExceptions = ['admin/syncApi'];

@Injectable()
export class ReqAuthenticatorInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisProxyService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const url = request.route.path.toLowerCase().split('/').slice(3).join('/');
    const method = request.method.toUpperCase();
    const userRoles = (request?.user?.payload?.roles as string[]) || [];

    const key = RouteAuthRedisKeyMaker(url, method);
    let value: string | RedisValueType = await this.redisService.get(key);

    //
    for (let item of whiteExceptions) {
      if (url.toLowerCase().includes(item)) {
        return next.handle();
      }
    }

    if (!value) {
      throw new NotFoundException('Unknown Endpoint');
    }

    value = JSON.parse(value) as RedisValueType;

    if (value.isPublic) {
      return next.handle();
    }
    if (userRoles.includes('ADMIN')) {
      return next.handle();
    }

    let flag: boolean = false;
    for (let role of value.roles) {
      if (userRoles.includes(role)) {
        flag = true;
        break;
      }
    }

    if (!flag) throw new ForbiddenException('No Access');
    return next.handle();
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
