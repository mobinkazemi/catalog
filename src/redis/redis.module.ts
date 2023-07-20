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
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          name: configService.get('redis.name'),
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
