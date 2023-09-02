import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { RedisKeyEnums } from '../auth/eunms/redis-keys.enums';
import { HasSessionDto } from '../auth/dto/hasSession.dto';
import { RoutesRedisKeysEnum } from 'src/routes/enums/redis-keys-enums';
import { deleteRedisKey } from './types/delete.type';

@Injectable()
export class RedisProxyService {
  private redis: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redis = redisService.getClient();
  }

  private getAccessKey(userId: string, accessToken: string) {
    return RedisKeyEnums.SESSION.concat(
      RedisKeyEnums.SEPARATOR,
      userId,
      RedisKeyEnums.SEPARATOR,
      accessToken.slice(-4),
    );
  }
  private getRefreshKey(userId: string, refreshToken: string) {
    return RedisKeyEnums.SESSION.concat(
      RedisKeyEnums.SEPARATOR,
      userId,
      RedisKeyEnums.SEPARATOR,
      refreshToken.slice(-4),
    );
  }
  private getSessionKey(userId: string, sessionId: number) {
    return RedisKeyEnums.SESSION.concat(
      RedisKeyEnums.SEPARATOR,
      userId,
      RedisKeyEnums.SEPARATOR,
      sessionId.toString(),
    );
  }

  async setSession(
    userId: string,
    accessToken: string,
    refreshToken: string,
    sessionId: number,
  ) {
    const keyAcc = this.getAccessKey(userId, accessToken);
    const keyRef = this.getRefreshKey(userId, refreshToken);
    const keySes = this.getSessionKey(userId, sessionId);

    const valueAcc = refreshToken;
    const valueRef = accessToken;
    const valueSes = 'true';

    await this.redis.set(keyAcc, valueAcc);
    await this.redis.set(keyRef, valueRef);
    await this.redis.set(keySes, valueSes);
  }

  async hasSession(userId: string, { accessToken, sessionId }: HasSessionDto) {
    const key = accessToken
      ? this.getAccessKey(userId, accessToken)
      : this.getSessionKey(userId, sessionId);

    return await this.redis.get(key);
  }

  async delSession(userId: string, accessToken: string, sessionId: number) {
    const keyAcc = this.getAccessKey(userId, accessToken);
    const keySes = this.getSessionKey(userId, sessionId);

    const refreshToken = await this.redis.get(keyAcc);

    const keyRef = this.getRefreshKey(userId, refreshToken);

    await this.redis.del(keyAcc);
    await this.redis.del(keyRef);
    await this.redis.del(keySes);
  }

  async refSession(
    userId: string,
    refreshToken: string,
    newAcc: string,
    newRef: string,
    oldSessionId: number,
    newSessionId: number,
  ) {
    await this.delSession(userId, refreshToken, oldSessionId);
    await this.setSession(userId, newAcc, newRef, newSessionId);
  }

  async set(key: string, value: string, ttl?: number) {
    await this.redis.set(key, value);
    if (ttl) {
      await this.redis.expire(key, ttl);
    }
  }

  async get(key: string) {
    return await this.redis.get(key);
  }

  async getHello() {
    return await this.redis.hello();
  }

  async delete(data: deleteRedisKey) {
    if (data.key) {
      await this.redis.del(data.key);
    } else {
      const pattern = data.pattern.concat('*');
      const keys = await this.redis.keys(pattern);
      await Promise.all(keys.map((k) => this.redis.del(k)));
    }
  }
}
