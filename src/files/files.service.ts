import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { findByIdDto } from 'src/common/dto/base-repository-dtos.dto';
import { ResponseAfterCreateDto } from '../common/dto/response-after-create.dto';
import { MinioClientService } from '../minio/minio.service';
import { CreateFileDto } from './dto/request/create-file.dto';
import { FilesRepository } from './files.repository';
import { File, FileDocument } from './schema/files.schema';

@Injectable()
export class FilesService {
  constructor(
    private readonly fileRepository: FilesRepository,
    private readonly minioService: MinioClientService,
  ) {}

  async create(file: Express.Multer.File): Promise<ResponseAfterCreateDto> {
    // should be first to also check if minio service is running in background, before inserting anything to mongo
    await this.minioService.createBucketIfNotExists();

    const savedFile = await this.fileRepository.create(file);

    await this.minioService.uploadFile(file, savedFile.id);

    return savedFile;
  }

  findAll() {
    throw new NotImplementedException();
  }

  async findOne(id: string, error?: boolean) {
    const file = await this.fileRepository.findOne<File>(id);
    if (!file && error) throw new NotFoundException();

    return file;
  }

  async findOneWithStoredObject(id: string, error?: boolean) {
    const file = await this.findOne(id, error);

    if (!file && !error) return;

    const objectStream = await this.minioService.getFile(file.id);

    return {
      fileInfo: file,
      stream: objectStream,
    };
  }

  async remove(data: findByIdDto, error?: boolean): Promise<void> {
    const file = await this.findOne(data.id, error);

    if (!file) return;

    await this.fileRepository.remove(data);
    await this.minioService.deleteFile(data.id);
  }
}
