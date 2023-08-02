import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './controllers/files.controller';
import { MinioClientService } from '../minio/minio.service';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schema/files.schema';
import { FilesRepository } from './files.repository';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  controllers: [FilesController],
  providers: [FilesService, MinioClientService, FilesRepository],
})
export class FilesModule {}
