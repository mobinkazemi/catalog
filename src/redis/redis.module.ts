import { Module } from '@nestjs/common';
import {RedisModule} from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ]
})
export class RedisProxyModule {}
