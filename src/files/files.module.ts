import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './controllers/files.controller';
import { MinioClientService } from '../minio/minio.service';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schema/files.schema';
import { FilesRepository } from './files.repository';
import { RedisProxyModule } from 'src/redis/redis.module';
import { RedisProxyService } from 'src/redis/redis.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    RedisProxyModule,
  ],
  controllers: [FilesController],
  providers: [
    FilesService,
    MinioClientService,
    FilesRepository,
    RedisProxyService,
  ],
})
export class FilesModule {}
