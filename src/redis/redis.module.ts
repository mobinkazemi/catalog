import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisProxyService } from './redis.service';

interface Iconfig {
  host: string;
  port: number;
  name: string;
  password?: string;
}
@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        let config: Iconfig = {
          host: configService.getOrThrow('redis.host'),
          port: configService.getOrThrow('redis.port'),
          name: configService.getOrThrow('redis.name'),
        };

        if (configService.getOrThrow('redis.auth')) {
          config.password = configService.getOrThrow('redis.pass');
        }

        return {
          config,
        };
      },
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
