import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogRepository } from './log.repository.ts';
import { LogService } from './log.service';
import { Log, LogSchema } from './schema/log.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  controllers: [],
  providers: [LogService, LogRepository],
})
export class LogModule {}
