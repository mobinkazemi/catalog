import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { RedisKeyEnums } from 'src/auth/eunms/redis-keys.enums';
import { HasSessionDto } from 'src/auth/dto/hasSession.dto';

@Injectable()
export class RedisProxyService {
  private redis: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redis = redisService.getClient();
  }

  async setSession(
    userId: string,
    accessToken: string,
    refreshToken: string,
    sessionId?: number,
  ) {
    const key1 = RedisKeyEnums.SESSION.concat(
      RedisKeyEnums.SEPARATOR,
      userId,
      RedisKeyEnums.SEPARATOR,
      accessToken.slice(-4),
    );
    const key2 = RedisKeyEnums.SESSION.concat(
      RedisKeyEnums.SEPARATOR,
      userId,
      RedisKeyEnums.SEPARATOR,
      refreshToken.slice(-4),
    );

    const value1 = refreshToken;
    const value2 = accessToken;

    await this.redis.set(key1, value1);
    await this.redis.set(key2, value2);

    if (sessionId) {
      const thisKey = RedisKeyEnums.SESSION.concat(
        RedisKeyEnums.SEPARATOR,
        userId,
        RedisKeyEnums.SEPARATOR,
        sessionId.toString(),
      );

      await this.redis.lpush(thisKey, accessToken, refreshToken);
    }
  }

  async hasSession(userId: string, { accessToken, sessionId }: HasSessionDto) {
    const key = RedisKeyEnums.SESSION.concat(
      RedisKeyEnums.SEPARATOR,
      userId,
      RedisKeyEnums.SEPARATOR,
      accessToken.slice(-4) || sessionId.toString(),
    );

    if (accessToken) {
      return await this.redis.get(key);
    }

    return await this.redis.lrange(key, 0, -1);
  }

  async delSession(userId: string, accessToken: string) {
    const key1 = RedisKeyEnums.SESSION.concat(
      RedisKeyEnums.SEPARATOR,
      userId,
      RedisKeyEnums.SEPARATOR,
      accessToken.slice(-4),
    );

    const refreshToken = await this.redis.get(key1);

    const key2 = RedisKeyEnums.SESSION.concat(
      RedisKeyEnums.SEPARATOR,
      userId,
      RedisKeyEnums.SEPARATOR,
      refreshToken.slice(-4),
    );

    await this.redis.del(key1);
    await this.redis.del(key2);
  }

  async refSession(
    userId: string,
    refreshToken: string,
    newAcc: string,
    newRef: string,
    sessionId?: number,
  ) {
    await this.delSession(userId, refreshToken);

    await this.setSession(userId, newAcc, newRef, sessionId);
  }

  async getHello() {
    return await this.redis.hello();
  }
}
