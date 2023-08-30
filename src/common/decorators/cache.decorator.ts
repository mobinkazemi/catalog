import { Inject } from '@nestjs/common';
import { RedisProxyService } from 'src/redis/redis.service';

export function Cacher(prekey: string, ttl?: number) {
  if (!ttl) ttl = 600; // 10 Minutes
  const redisService = Inject(RedisProxyService);

  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;
    redisService(target, 'redis');

    descriptor.value = async function (...args: any[]) {
      const key = prekey.concat(JSON.stringify(args));
      let result = await this.redis.get(key);

      if (result) return JSON.parse(result);

      result = await fn.apply(this, args);

      // Below code will not execute for Error responses
      await this.redis.set(key, JSON.stringify(result), ttl);

      return result;
    };

    return descriptor;
  };
}
