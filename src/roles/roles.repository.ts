import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BaseRepository,
  OptionsDto,
} from '../database/repository/base.repository';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { FindRoleDto } from './dto/request/find-role.dto';
import { FindRolesListDto } from './dto/request/find-roles.dto';
import { Role, RoleDocument } from './schema/roles.schema';

@Injectable()
export class RolesRepository extends BaseRepository {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {
    super();
  }

  async findOne<Role>(data?: FindRoleDto, options?: OptionsDto): Promise<Role> {
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

    return await this.roleModel.findOne(query);
  }

  async findAll<Role>(
    data?: FindRolesListDto,
    options?: OptionsDto,
  ): Promise<Role[]> {
    let query = {};
    if (!data) data = {};

    query = {
      ...query,
      ...data,
      isDeleted: null,
    };

    if (options) {
      query = this.addOptions(query, options);
    }

    return await this.roleModel.find(query);
  }

  async create(data: CreateRoleDto) {
    return await this.roleModel.create({
      ...data,
      name: data.name.toUpperCase(),
    });
  }
}
