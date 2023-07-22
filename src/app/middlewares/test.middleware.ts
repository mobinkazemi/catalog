import { Injectable, NestMiddleware } from '@nestjs/common';
import { RedisProxyService } from '../../redis/redis.service';

@Injectable()
export class sampleMiddleware implements NestMiddleware {
  constructor(private redisService: RedisProxyService) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    console.log(req.url);
    // console.log(await this.redisService.getHello());

    next();
  }
}
