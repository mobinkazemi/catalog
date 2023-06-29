import { Module } from '@nestjs/common';
import { ConfigService,ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({    
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri'),
        connectTimeoutMS: configService.get('database.timeout')
    }) })
  ],
})
export class DatabaseModule {}
