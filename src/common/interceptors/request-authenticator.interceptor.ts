import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { LogService } from 'src/log/log.service';
import { RedisProxyService } from 'src/redis/redis.service';
import { RoutesRedisKeysEnum } from 'src/routes/enums/redis-keys-enums';
import { RouteAuthRedisKeyMaker } from '../functions/get-route-redis-key.function';

type RedisValueType = { roles: Array<string>; isPublic?: boolean };
const whiteListApis = ['admin/reloadApi'];

@Injectable()
export class ReqAuthenticatorInterceptor implements NestInterceptor {
  constructor(
    private readonly redisService: RedisProxyService,
    private readonly appService: AppService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    //
    //
    //
    // First ensures routes data exists in Redis
    const routesDataExistsInRedis = await this.redisService.get(
      RoutesRedisKeysEnum.ROUTE_KEYS_REACHABLE,
    );

    if (!routesDataExistsInRedis) {
      await this.appService.reloadRoutes();
    }

    //
    //
    //
    // Read and cook request info
    const request = context.switchToHttp().getRequest();
    const url = request.route.path.toLowerCase().split('/').slice(3).join('/');
    const method = request.method.toUpperCase();
    const userRoles = (request?.user?.payload?.roles as string[]) || [];

    //
    //
    //
    // Get endpoint detail from Redis
    const key = RouteAuthRedisKeyMaker(url, method);
    let value: string | RedisValueType = await this.redisService.get(key);

    //
    //
    //
    // Error: if endpoint not available
    if (!value) {
      throw new NotFoundException('Unknown Endpoint');
    }

    //
    //
    //
    // True: if endpoint exists in whitelist
    for (let item of whiteListApis) {
      if (url.includes(item.toLowerCase())) {
        return next.handle();
      }
    }

    //
    //
    //
    // Parse value from string to JSON
    value = JSON.parse(value) as RedisValueType;

    //
    //
    //
    // Validate request:

    // 1. True if endpoint is pulic
    if (value.isPublic) {
      return next.handle();
    }

    // 2. True if requester's role is super admin
    if (userRoles.includes('ADMIN')) {
      return next.handle();
    }

    // 3. Check access for other roles
    let hasAccess: boolean = false;
    for (let role of value.roles) {
      if (userRoles.includes(role)) {
        hasAccess = true;
        break;
      }
    }

    if (!hasAccess) {
      throw new ForbiddenException('No Access');
    }

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
