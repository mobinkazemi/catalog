import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RepositoryOptionsDto,
  findByIdDto,
  addListOptionsDto,
} from '../common/dto/base-repository-dtos.dto';
import { BaseRepository } from '../common/repository/base.repository';
import { CreateUserDto } from './dto/request/create-user.dto';
import { FilterRequestUserDto } from './dto/request/filter-user.dto';
import { FindUserDto } from './dto/request/findone-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { User, UserDocument } from './schema/users.schema';
import * as _ from 'lodash';
import { UpdateRoleDto } from '../roles/dto/request/update-role.dto';
import { BaseSchemaDto } from 'src/database/dto/base.dto';
import { ObjectIdOrString } from 'src/common/types/types';
import { UserPartialType } from './types/partial-user.type';

@Injectable()
export class UsersRepository extends BaseRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super();
  }

  async findOne<User>(
    data?: FindUserDto,
    options?: RepositoryOptionsDto,
  ): Promise<User> {
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

    return await this.userModel.findOne(query);
  }

  async findAll<User>(
    data?: FilterRequestUserDto,
    listOptions?: addListOptionsDto,
    options?: RepositoryOptionsDto,
  ): Promise<User[]> {
    let query = {};
    if (!data) data = {};
    if (!listOptions) listOptions = {};

    data = new FilterRequestUserDto(data);

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

    return await this.userModel.find(
      query,
      {},
      {
        sort,
        limit,
        skip,
      },
    );
  }

  async create<User>(createUserDto: UserPartialType): Promise<User> {
    return await (await this.userModel.create(createUserDto)).toObject();
  }

  async update<User>(
    findData: UserPartialType,
    updateData: UserPartialType,
    options?: RepositoryOptionsDto,
  ): Promise<User> {
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

    return await this.userModel.findOneAndUpdate(
      query,
      { $set: updateData },
      {
        new: true,
      },
    );
  }

  async remove(data: UserPartialType) {
    if (data.id) {
      data._id = this.convertToObjectId(data.id as string);
      delete data.id;
    }
    await this.userModel.updateOne(data, { $set: { deletedAt: Date.now() } });
  }
}
