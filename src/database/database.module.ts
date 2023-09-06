import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

interface dbConf {
  uri: string;
  dbName?: string;
  connectTimeoutMS?: number;
  authMechanism?: 'DEFAULT';
  user?: string;
  pass?: string;
}
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let conf: dbConf;
        const auth = configService.getOrThrow('database.requiredAuth');

        if (!auth) {
          conf = {
            uri: configService.getOrThrow('database.uri'),
            connectTimeoutMS: configService.getOrThrow('database.timeout'),
          };
        } else {
          conf = {
            uri: configService.getOrThrow('database.uri'),
            dbName: configService.getOrThrow('database.name'),
            connectTimeoutMS: configService.getOrThrow('database.timeout'),
            authMechanism: 'DEFAULT',
            user: configService.getOrThrow('database.username'),
            pass: configService.getOrThrow('database.password'),
          };
        }

        return conf;
      },
    }),
  ],
})
export class DatabaseModule {}
