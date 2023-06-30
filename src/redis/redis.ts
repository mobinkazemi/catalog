import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisProxyService {
  private redis: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redis = redisService.getClient();
  }
}
