import mongoose from 'mongoose';
import {
  addLimitDto,
  addListOptionsDto,
  addPaginationDto,
  addSortDto,
  OptionsDto,
} from '../../common/dto/base-repository-dtos.dto';
import * as _ from 'lodash';
import { ObjectIdType } from 'src/common/types/types';
export abstract class BaseRepository {
  abstract findOne<T>(data: any, options?: OptionsDto): Promise<T>;
  abstract findAll<T>(
    data?: any,
    listOptions?: addListOptionsDto,
    options?: OptionsDto,
  ): Promise<T[]>;

  protected addOptions(data: any, options: OptionsDto) {
    if (options.show) {
      switch (options.show) {
        case 'all':
          delete data.deletedAt;
          break;

        case 'removed':
          data.deletedAt = { $ne: null };
          break;
      }
    }

    return data;
  }

  protected convertToObjectId(data: string): ObjectIdType {
    return new mongoose.Types.ObjectId(data);
  }

  protected addSort(data?: addSortDto) {
    const { sort, asc } = data;
    let obj = {};

    let key: string;
    let value: 1 | -1;

    if (sort) key = sort;
    else key = 'createdAt';

    if (asc) value = 1;
    else value = -1;

    obj[key] = value;

    return obj;
  }

  protected addLimit(data?: addLimitDto) {
    const { limit } = data;

    return limit || 20;
  }
  protected addPagination(data?: addPaginationDto) {
    const { page } = data;

    return page || 1;
  }

  protected addListOptions(data: addListOptionsDto) {
    if (!data) data = {};

    const sort = this.addSort(_.pick(data, ['sort', 'asc']));
    const limit = this.addLimit(_.pick(data, ['limit']));
    const page = this.addPagination(_.pick(data, ['page']));
    const skip = (page - 1) * limit;

    return {
      sort,
      limit,
      skip,
    };
  }
}
