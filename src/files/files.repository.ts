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
    super();
  }

  async findOne<File>(
    id: string,
    options?: RepositoryOptionsDto,
  ): Promise<File> {
    let query = {
      _id: this.convertToObjectId(id),
      deletedAt: null,
    };

    if (options) {
      query = this.addOptions(query, options);
    }

    return await this.fileModel.findOne(query);
  }

  async findAll<T>(
    data?: any,
    listOptions?: addListOptionsDto,
    options?: RepositoryOptionsDto,
  ): Promise<T[]> {
    let query = {};
    if (!data) data = {};
    if (!listOptions) listOptions = {};

    return await this.fileModel.find();
  }
  async create<File>(file: Express.Multer.File): Promise<File> {
    const { size, originalname, mimetype } = file;

    const result = await this.fileModel.create({
      size,
      name: originalname,
      mime: mimetype,
    });
    return result.toObject();
  }

  async remove(data: findByIdDto): Promise<void> {
    await this.fileModel.updateOne(
      {
        _id: this.convertToObjectId(data.id),
      },
      {
        $set: { deletedAt: Date.now() },
      },
    );
  }

  async update<File>(
    findData: PartialFileType,
    updateData: PartialFileType,
    options?: RepositoryOptionsDto,
  ): Promise<File> {
    let query = {};

    if (findData.id) {
      query['_id'] = this.convertToObjectId(findData.id);
      delete findData.id;
    }

    query = {
      ...query,
      ...findData,
      deletedAt: null,
    };

    if (options) {
      query = this.addOptions(query, options);
    }

    return await this.fileModel.findOneAndUpdate(
      query,
      { $set: updateData },
      {
        new: true,
      },
    );
  }
}
