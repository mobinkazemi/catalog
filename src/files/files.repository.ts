import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BaseRepository,
  OptionsDto,
} from 'src/database/repository/base.repository';
import { File, FileDocument } from './schema/files.schema';
@Injectable()
export class FilesRepository extends BaseRepository {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
  ) {
    super();
  }

  async findOne<File>(id: string, options?: OptionsDto): Promise<File> {
    let query = {
      _id: this.convertToObjectId(id),
      isDeleted: null,
    };

    if (options) {
      query = this.addOptions(query, options);
    }

    return await this.fileModel.findOne(query);
  }

  async findAll<T>(data: any, options?: OptionsDto): Promise<T[]> {
    return await this.fileModel.find();
  }
  async create(file: Express.Multer.File): Promise<File> {
    const { size, originalname, mimetype } = file;
    return await this.fileModel.create({
      size,
      name: originalname,
      mime: mimetype,
    });
  }
}