import { Injectable } from '@nestjs/common';
import { LogRepository } from './log.repository.ts';
import { Log } from './schema/log.schema';

@Injectable()
export class LogService {
  constructor(private readonly logRepository: LogRepository) {}
  async create(createLogDto: Partial<Log>) {
    await this.logRepository.create(createLogDto);
  }
}
