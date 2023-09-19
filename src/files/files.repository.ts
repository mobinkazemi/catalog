import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  addListOptionsDto,
  findByIdDto,
  RepositoryOptionsDto,
} from '../common/dto/base-repository-dtos.dto';
import { BaseRepository } from 'src/common/repository/base.repository';
import { File, FileDocument } from './schema/files.schema';
import { PartialFileType } from './types/partial-file.type';
@Injectable()
export class FilesRepository extends BaseRepository {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
  ) {
    super(fileModel);
  }

  async findOne<File>(
    data: PartialFileType,
    options?: RepositoryOptionsDto,
  ): Promise<File> {
    return await this.baseFindOne(data as Partial<File>, options);
  }

  async findAll<File>(
    data?: PartialFileType,
    listOptions?: addListOptionsDto,
    options?: RepositoryOptionsDto,
  ): Promise<File[]> {
    return await this.baseFindAll(data as Partial<File>, listOptions, options);
  }

  async create<File>(data: PartialFileType): Promise<File> {
    return await this.baseCreate(data as Partial<File>);
  }

  async remove<File>(
    findData: PartialFileType,
    options?: RepositoryOptionsDto,
  ): Promise<void> {
    await this.baseRemove(findData, options);
  }

  async update<File>(
    findData: PartialFileType,
    updateData: PartialFileType,
    options?: RepositoryOptionsDto,
  ): Promise<File> {
    return await this.baseUpdate(
      findData as Partial<File>,
      updateData as Partial<File>,
      options,
    );
  }
}
