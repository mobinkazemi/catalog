import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log({
          ////
          uri: configService.getOrThrow('database.uri'),
          dbName: configService.getOrThrow('database.name'),
          connectTimeoutMS: configService.getOrThrow('database.timeout'),
          authMechanism: 'DEFAULT',
          user: configService.getOrThrow('database.username'),
          pass: configService.getOrThrow('database.password'),
        });

        return {
          ////
          uri: configService.getOrThrow('database.uri'),
          dbName: configService.getOrThrow('database.name'),
          connectTimeoutMS: configService.getOrThrow('database.timeout'),
          authMechanism: 'DEFAULT',
          user: configService.getOrThrow('database.username'),
          pass: configService.getOrThrow('database.password'),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
