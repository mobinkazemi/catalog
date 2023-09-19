import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  addListOptionsDto,
  findByIdDto,
} from 'src/common/dto/base-repository-dtos.dto';
import { ServiceOptionsDto } from 'src/common/dto/service-options.dto';
import { BaseService } from 'src/common/services/base.service';
import { ResponseAfterCreateDto } from '../common/dto/response-after-create.dto';
import { MinioClientService } from '../minio/minio.service';
import { RemoveFileServiceOptions } from './dto/other/remove-service-options.dto';
import { CreateFileDto } from './dto/request/create-file.dto';
import { FileMessagesEnum } from './enums/messages.enum';
import { FilesRepository } from './files.repository';
import { File, FileDocument } from './schema/files.schema';
import { PartialFileType } from './types/partial-file.type';

@Injectable()
export class FilesService extends BaseService {
  constructor(private readonly fileRepository: FilesRepository) {
    super();
  }

  async create<File>(data: PartialFileType): Promise<File> {
    return await this.fileRepository.create<File>(data);
  }

  async findOne<File>(
    data: PartialFileType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<File> {
    const file = await this.fileRepository.findOne<File>(data, serviceOptions);

    if (!file && serviceOptions.error) {
      throw new NotFoundException(FileMessagesEnum.FILE_NOT_FOUND);
    }

    return file;
  }

  async findAll<File>(
    data: Partial<File>,
    listOptions?: addListOptionsDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<File[]> {
    return await this.fileRepository.baseFindAll(
      data,
      listOptions,
      serviceOptions,
    );
  }

  async update<File>(
    findData: Partial<File>,
    updateData: Partial<File>,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<File> {
    return await this.fileRepository.baseUpdate(
      findData,
      updateData,
      serviceOptions,
    );
  }

  async remove<File>(
    data: Partial<File>,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<void> {
    const file = await this.findOne(Object.assign({}, data), serviceOptions);

    if (!file) return;

    await this.fileRepository.remove(data);
  }
}
