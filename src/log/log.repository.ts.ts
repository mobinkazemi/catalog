import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  addListOptionsDto,
  RepositoryOptionsDto,
} from 'src/common/dto/base-repository-dtos.dto';
import { BaseRepository } from 'src/common/repository/base.repository';
import { Log, LogDocument } from './schema/log.schema';

@Injectable()
export class LogRepository extends BaseRepository {
  constructor(
    @InjectModel(Log.name) private readonly logModel: Model<LogDocument>,
  ) {
    super();
  }

  async create(createLogDto: Partial<Log>) {
    await this.logModel.create(createLogDto);
  }

  async findAll<Log>(
    data?: any,
    listOptions?: addListOptionsDto,
    options?: RepositoryOptionsDto,
  ): Promise<Log[]> {
    return;
  }

  async findOne<Log>(data: any, options?: RepositoryOptionsDto): Promise<Log> {
    return;
  }
}
