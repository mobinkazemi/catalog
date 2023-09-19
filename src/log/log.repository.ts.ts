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
    super(logModel);
  }

  async create<Log>(createLogDto: PartialLogType): Promise<Log> {
    return await this.baseCreate(createLogDto as Partial<Log>);
  }

  async findOne<Log>(
    data?: PartialLogType,
    options?: RepositoryOptionsDto,
  ): Promise<Log> {
    return await this.baseFindOne(data as Partial<Log>, options);
  }

  async findAll<Log>(
    data?: PartialLogType,
    listOptions?: addListOptionsDto,
    options?: RepositoryOptionsDto,
  ): Promise<Log[]> {
    return await this.baseFindAll(data as Partial<Log>, listOptions, options);
  }

  async update<Log>(
    findData: PartialLogType,
    updateData: PartialLogType,
    options?: RepositoryOptionsDto,
  ): Promise<Log> {
    return await this.baseUpdate(
      findData as Partial<Log>,
      updateData as Partial<Log>,
      options,
    );
  }

  async remove<Log>(
    findData: PartialLogType,
    options?: RepositoryOptionsDto,
  ): Promise<void> {
    return await this.baseRemove(findData as Partial<Log>, options);
  }
}
