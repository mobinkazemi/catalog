import { Inject } from '@nestjs/common';
import { RedisProxyService } from 'src/redis/redis.service';
import * as _ from 'lodash';

interface OptionsDto {
  ttl?: number;
  numArgsToUseFromFirst?: number;
  numArgsToUseFromLast?: number;
  pickArgsToUse?: Array<String>;
}

export function Cacher(prekey: string, options?: OptionsDto) {
  options = options || {};

  if (!options.ttl) options.ttl = 600; // 10 Minutes
  const redisService = Inject(RedisProxyService);

  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;
    redisService(target, 'redis');

    descriptor.value = async function (...args: any[]) {
      let argsForKey = options.numArgsToUseFromFirst
        ? args.slice(0, options.numArgsToUseFromFirst)
        : options.numArgsToUseFromLast
        ? args.slice(-options.numArgsToUseFromLast)
        : args;

      if (options.pickArgsToUse) {
        argsForKey = argsForKey.map((item) => {
          item = _.pick(item, options.pickArgsToUse);
          return item;
        });
      }

      const key = prekey.concat(JSON.stringify(argsForKey));
      let result = await this.redis.get(key);

      if (result) return JSON.parse(result);

      result = await fn.apply(this, args);

      // Below code will not execute for Error responses
      await this.redis.set(key, JSON.stringify(result), options.ttl);

      return result;
    };

    return descriptor;
  };
}
