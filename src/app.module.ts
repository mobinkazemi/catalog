import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
// console.log(require("dotenv").config())
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: `${process.env.NODE_ENV}.env`, load: [configuration]}),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


