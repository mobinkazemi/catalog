import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  findByIdDto,
  BaseRepository,
  OptionsDto,
} from '../database/repository/base.repository';
import { CreateUserDto } from './dto/request/create-user.dto';
import { FilterRequestUserDto } from './dto/request/filter-user.dto';
import { FindUserDto } from './dto/request/findone-user.dto';
import { User, UserDocument } from './schema/users.schema';

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
      isDeleted: null,
    };

    if (options) {
      query = this.addOptions(query, options);
    }

    return await this.userModel.findOne(query);
  }

  async findAll<User>(
    data?: FilterRequestUserDto,
    options?: OptionsDto,
  ): Promise<User[]> {
    let query = {};
    if (!data) data = {};

    data = new FilterRequestUserDto(data);

    if (data.id) {
      query['_id'] = this.convertToObjectId(data.id);
      delete data.id;
    }

    query = {
      ...query,
      ...data,
      isDeleted: null,
    };

    if (options) {
      query = this.addOptions(query, options);
    }

    return await this.userModel.find(query);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userModel.create(createUserDto);
  }
}
