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
import { PartialRoleType } from './types/partial-role.type';

@Injectable()
export class RolesRepository extends BaseRepository {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {
    super(roleModel);
  }

  async findOne<Role>(
    data?: FindRoleDto,
    options?: RepositoryOptionsDto,
  ): Promise<Role> {
    return await this.baseFindOne(data as Partial<Role>, options);
  }

  async findAll<Role>(
    data?: FindRolesListDto,
    listOptions?: addListOptionsDto,
    options?: RepositoryOptionsDto,
  ): Promise<Role[]> {
    return await this.baseFindAll(data as Partial<Role>, listOptions, options);
  }

  async create<Role>(data: PartialRoleType): Promise<Role> {
    return await this.baseCreate(data as Partial<Role>);
  }
  async remove<Role>(
    findData: PartialRoleType,
    options?: RepositoryOptionsDto,
  ): Promise<void> {
    await this.baseRemove(findData as Partial<Role>, options);
  }

  async update<Role>(
    findData: PartialRoleType,
    updateData: PartialRoleType,
    options?: RepositoryOptionsDto,
  ): Promise<Role> {
    return await this.baseUpdate(
      findData as Partial<Role>,
      updateData as Partial<Role>,
      options,
    );
  }
}
