import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { RedisProxyModule } from '../redis/redis.module';
import { MinioClientService } from '../minio/minio.service';
import { FilesModule } from '../files/files.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SeederModule } from '../seeder/seeder.module';
import { sampleMiddleware } from './middlewares/test.middleware';
import { RedisProxyService } from 'src/redis/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, `secret.env`],
      load: [configuration],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    RolesModule,
    RedisProxyModule,
    FilesModule,
    ScheduleModule.forRoot(),
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService, MinioClientService, RedisProxyService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(sampleMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
