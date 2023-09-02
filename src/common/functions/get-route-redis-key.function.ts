import { RoutesRedisKeysEnum } from 'src/routes/enums/redis-keys-enums';

export function RouteAuthRedisKeyMaker(route: string, method: string): string {
  return RoutesRedisKeysEnum.PRE_ROUTE_AUTH_KEY.concat(':', method, ':', route);
}
