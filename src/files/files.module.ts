import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MinioClientService } from '../minio/minio.service';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schema/files.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  controllers: [FilesController],
  providers: [FilesService, MinioClientService],
})
export class FilesModule {}
