import { Injectable } from '@nestjs/common';
import { Request, Router } from 'express';
import { RouteAuthRedisKeyMaker } from 'src/common/functions/get-route-redis-key.function';
import { RedisProxyService } from 'src/redis/redis.service';
import { RoutesRedisKeysEnum } from 'src/routes/enums/redis-keys-enums';
import { RoutesService } from 'src/routes/routes.service';
import { Route } from 'src/routes/schema/routes.schema';
@Injectable()
export class AppService {
  constructor(
    private readonly routeService: RoutesService,
    private readonly redisService: RedisProxyService,
  ) {}
  getEndpoints(req: Request) {
    const router = req.app._router as Router;

    return router.stack
      .map((layer) => {
        if (layer.route) {
          const path = layer.route?.path;
          const method = layer.route?.stack[0].method;
          return {
            method,
            path,
          };
        }
      })
      .filter((item) => item !== undefined)
      .filter((item) => item.path.slice(0, 4) == '/api')
      .filter((item) => item.method != 'acl')
      .map((item) => ({
        method: item.method.toUpperCase(),
        path: item.path.split('/').slice(3).join('/'),
      }));
  }

  async syncApi(req: Request) {
    const endpointsList = this.getEndpoints(req);

    await Promise.all(
      endpointsList.map((item) =>
        this.routeService.create(item as Route, { error: false }),
      ),
    );

    await this.reloadRoutes();
  }

  async reloadRoutes() {
    const routes = await this.routeService.findAll({}, { limit: 1000 });

    await this.redisService.delete({
      pattern: RoutesRedisKeysEnum.PRE_ROUTE_AUTH_KEY,
    });

    await Promise.all(
      routes.map((item) => {
        const key = RouteAuthRedisKeyMaker(item.path, item.method);

        const value = JSON.stringify({
          roles: item.roles,
          isPublic: item.isPublic,
        });

        return this.redisService.set(key, value);
      }),
    );
  }
}
