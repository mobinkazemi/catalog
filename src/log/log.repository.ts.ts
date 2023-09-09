import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  addListOptionsDto,
  RepositoryOptionsDto,
} from 'src/common/dto/base-repository-dtos.dto';
import { BaseRepository } from 'src/common/repository/base.repository';
import { Log, LogDocument } from './schema/log.schema';
import { PartialLogType } from './types/partial-log.type';

@Injectable()
export class LogRepository extends BaseRepository {
  constructor(
    @InjectModel(Log.name) private readonly logModel: Model<LogDocument>,
  ) {
    super();
  }

  async create<Log>(createLogDto: PartialLogType): Promise<Log> {
    return (await this.logModel.create(createLogDto)).toObject();
  }

  async findOne<Log>(
    data?: PartialLogType,
    options?: RepositoryOptionsDto,
  ): Promise<Log> {
    let query = {};
    if (!data) data = {};

    if (data.id) {
      query['_id'] = this.convertToObjectId(data.id);
      delete data.id;
    }

    query = {
      ...query,
      ...data,
      deletedAt: null,
    };

    if (options) {
      query = this.addOptions(query, options);
    }

    return await this.logModel.findOne(query);
  }

  async findAll<Log>(
    data?: PartialLogType,
    listOptions?: addListOptionsDto,
    options?: RepositoryOptionsDto,
  ): Promise<Log[]> {
    let query = {};
    if (!data) data = {};
    if (!listOptions) listOptions = {};

    if (data.id) {
      query['_id'] = this.convertToObjectId(data.id);
      delete data.id;
    }

    query = {
      ...query,
      ...data,
      deletedAt: null,
    };

    if (options) {
      query = this.addOptions(query, options);
    }

    const { sort, limit, skip } = this.addListOptions(listOptions);

    return await this.logModel.find(
      query,
      {},
      {
        sort,
        limit,
        skip,
      },
    );
  }

  async update<Log>(
    findData: PartialLogType,
    updateData: PartialLogType,
    options?: RepositoryOptionsDto,
  ): Promise<Log> {
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

    return await this.logModel.findOneAndUpdate(
      query,
      { $set: updateData },
      {
        new: true,
      },
    );
  }
}
