import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisProxyService } from './redis.service';
@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.getOrThrow('redis.host'),
          port: configService.getOrThrow('redis.port'),
          name: configService.getOrThrow('redis.name'),
        },
      }),
    }),
  ],
  providers: [
    {
      useClass: RedisProxyService,
      provide: 'REDIS_SERVICE',
    },
  ],
})
export class RedisProxyModule {}
