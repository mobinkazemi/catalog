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
        return {
          uri: configService.getOrThrow('database.uri'),
          connectTimeoutMS: configService.getOrThrow('database.timeout'),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
