import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OptionsDto,
  findByIdDto,
  addListOptionsDto,
} from '../common/dto/base-repository-dtos.dto';
import { BaseRepository } from '../database/repository/base.repository';
import { CreateUserDto } from './dto/request/create-user.dto';
import { FilterRequestUserDto } from './dto/request/filter-user.dto';
import { FindUserDto } from './dto/request/findone-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { User, UserDocument } from './schema/users.schema';
import * as _ from 'lodash';
import { UpdateRoleDto } from '../roles/dto/request/update-role.dto';
import { BaseSchemaDto } from 'src/database/dto/base.dto';
import { ObjectIdOrString } from 'src/common/types/types';

@Injectable()
export class UsersRepository extends BaseRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super();
  }

  async findOne<User>(data?: FindUserDto, options?: OptionsDto): Promise<User> {
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
    options?: OptionsDto,
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

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userModel.create(createUserDto);
  }

  async updateOne<User>(
    data: FindUserDto,
    updateData: UpdateUserDto & BaseSchemaDto,
  ): Promise<User> {
    let query = {};

    if (data.id) {
      query['_id'] = this.convertToObjectId(data.id);
      delete data.id;
    }
    console.log(query);
    console.log(updateData);

    query = {
      ...query,
      ...data,
      deletedAt: null,
    };

    return await this.userModel.findOneAndUpdate(query, updateData, {
      new: true,
    });
  }

  async remove(id: ObjectIdOrString) {
    await this.userModel.updateOne(
      {
        _id: this.convertToObjectId(id as string),
      },
      { $set: { deletedAt: Date.now() } },
    );
  }
}
