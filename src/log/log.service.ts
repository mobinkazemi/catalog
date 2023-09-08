import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { addListOptionsDto } from 'src/common/dto/base-repository-dtos.dto';
import { ServiceOptionsDto } from 'src/common/dto/service-options.dto';
import { BaseService } from 'src/common/services/base.service';
import { LogRepository } from './log.repository.ts';
import { Log } from './schema/log.schema';
import { PartialLogType } from './types/partial-log.type';

@Injectable()
export class LogService extends BaseService {
  constructor(private readonly logRepository: LogRepository) {
    super();
  }
  async create<Log>(
    data: PartialLogType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Log> {
    return await this.logRepository.create<Log>(data);
  }

  async findOne<Log>(
    data: PartialLogType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Log> {
    const result = await this.findOne<Log>(data, serviceOptions);

    if (!result && serviceOptions.error) {
      //TODO msg
      throw new NotFoundException();
    }
    return result;
  }

  async findAll<Log>(
    data: PartialLogType,
    listOptions?: addListOptionsDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Log[]> {
    return await this.logRepository.findAll(data, listOptions, serviceOptions);
  }

  async update<Log>(
    findData: Partial<Log>,
    updateData: Partial<Log>,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Log> {
    throw new NotImplementedException();
  }

  async remove<Log>(
    data: Partial<Log>,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<void> {
    throw new NotImplementedException();
  }
}
