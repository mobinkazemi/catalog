import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './controllers/app.controller';
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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LogModule } from 'src/log/log.module';
import { LogService } from 'src/log/log.service';
import { LogRepository } from 'src/log/log.repository.ts';
import { Log, LogSchema } from 'src/log/schema/log.schema';
import { AdminAppController } from './controllers/admin.app.controller';
import { RoutesModule } from 'src/routes/routes.module';
import { RoutesService } from 'src/routes/routes.service';
import { RoutesRepository } from 'src/routes/routes.repository';
import { Route, RouteSchema } from 'src/routes/schema/routes.schema';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Template.name, schema: TemplateSchema },
      { name: Log.name, schema: LogSchema },
      { name: Route.name, schema: RouteSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['app.env', 'test.env'],
      load: [configuration],
    }),
    ThrottlerModule.forRoot({
      ttl: 1000 * 1,
      limit: 60,
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
    RoutesModule,
  ],
  controllers: [AppController, AdminAppController],
  providers: [
    AppService,
    MinioClientService,
    RedisProxyService,
    TemplatesService,
    TemplatesRepository,
    LogService,
    LogRepository,
    RoutesService,
    RoutesRepository,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(sampleMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
