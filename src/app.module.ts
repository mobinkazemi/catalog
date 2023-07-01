import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { RedisProxyModule } from './redis/redis.module';
import { MinioClientService } from './minio/minio.service';
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
  ],
  controllers: [AppController],
  providers: [AppService, MinioClientService],
})
export class AppModule {}
