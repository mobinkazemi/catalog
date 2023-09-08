import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  addListOptionsDto,
  findByIdDto,
  RepositoryOptionsDto,
} from '../common/dto/base-repository-dtos.dto';
import { BaseRepository } from '../common/repository/base.repository';
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

  async findOne<Role>(
    data?: FindRoleDto,
    options?: RepositoryOptionsDto,
  ): Promise<Role> {
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

    if (query['name']) query['name'] = query['name'].toUpperCase();

    return await this.roleModel.findOne(query);
  }

  async findAll<Role>(
    data?: FindRolesListDto,
    listOptions?: addListOptionsDto,
    options?: RepositoryOptionsDto,
  ): Promise<Role[]> {
    let query = {};
    if (!data) data = {};
    if (!listOptions) listOptions = {};

    query = {
      ...query,
      ...data,
      deletedAt: null,
    };

    if (options) {
      query = this.addOptions(query, options);
    }

    const { sort, limit, skip } = this.addListOptions(listOptions);

    return await this.roleModel.find(query, {}, { sort, limit, skip });
  }

  async create(data: CreateRoleDto) {
    return await this.roleModel.create(data);
  }
  async remove(data: findByIdDto): Promise<void> {
    await this.roleModel.updateOne(
      {
        _id: this.convertToObjectId(data.id),
      },
      {
        $set: { deletedAt: Date.now() },
      },
    );
  }
}
