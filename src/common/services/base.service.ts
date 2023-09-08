import { addListOptionsDto } from '../dto/base-repository-dtos.dto';
import { ServiceOptionsDto } from '../dto/service-options.dto';

export abstract class BaseService {
  abstract create<T>(
    data: Partial<T>,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Partial<T>>;

  abstract findOne<T>(
    data: Partial<T>,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Partial<T>>;

  abstract findAll<T>(
    data: Partial<T>,
    listOptions?: addListOptionsDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Array<Partial<T>>>;

  abstract update<T>(
    findData: Partial<T>,
    updateData: Partial<T>,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Partial<T>>;

  abstract remove<T>(
    data: Partial<T>,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<void>;
}
