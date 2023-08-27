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
import { RedisProxyService } from '../redis/redis.service';
import { TemplatesModule } from 'src/templates/templates.module';
import { TemplatesService } from 'src/templates/templates.service';
import { TemplatesRepository } from 'src/templates/templates.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Template,
  TemplateSchema,
} from 'src/templates/schema/templates.schema';
import { CategoryModule } from 'src/category/category.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { LogModule } from 'src/log/log.module';
import { LogService } from 'src/log/log.service';
import { LogRepository } from 'src/log/log.repository.ts';
import { Log, LogSchema } from 'src/log/schema/log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Template.name, schema: TemplateSchema },
      { name: Log.name, schema: LogSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      load: [configuration],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    LogModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    RolesModule,
    RedisProxyModule,
    FilesModule,
    ScheduleModule.forRoot(),
    SeederModule,
    TemplatesModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MinioClientService,
    RedisProxyService,
    TemplatesService,
    TemplatesRepository,
    LogService,
    LogRepository,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(sampleMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
