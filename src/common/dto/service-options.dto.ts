import { PartialType } from '@nestjs/mapped-types';
import { RepositoryOptionsDto } from './base-repository-dtos.dto';

export class ServiceOptionsDto extends PartialType(RepositoryOptionsDto) {
  error?: boolean;
}
