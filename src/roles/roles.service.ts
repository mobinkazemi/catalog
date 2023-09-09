import {
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceOptionsDto } from 'src/common/dto/service-options.dto';
import { BaseService } from 'src/common/services/base.service';
import {
  addListOptionsDto,
  findByIdDto,
} from '../common/dto/base-repository-dtos.dto';
import { ResponseAfterCreateDto } from '../common/dto/response-after-create.dto';
import { User, UserDocument } from '../users/schema/users.schema';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { FindRoleDto } from './dto/request/find-role.dto';
import { FindRolesListDto } from './dto/request/find-roles.dto';
import { UpdateRoleDto } from './dto/request/update-role.dto';
import { RoleMessagesEnum } from './enums/messages.enum';
import { RolesRepository } from './roles.repository';
import { Role, RoleDocument } from './schema/roles.schema';
import { PartialRoleType } from './types/partial-role.type';

@Injectable()
export class RolesService extends BaseService {
  constructor(private readonly roleRepository: RolesRepository) {
    super();
  }
  async create<Role>(
    createRoleDto: PartialRoleType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Role> {
    const duplicate = await this.roleRepository.findOne(
      {
        name: createRoleDto.name,
      },
      { show: 'all' },
    );

    if (duplicate && serviceOptions?.error)
      throw new ConflictException(RoleMessagesEnum.ROLE_NAME_CONFLICT);
    if (duplicate) return;

    const result = await this.roleRepository.create<Role>({
      ...createRoleDto,
    });

    return result;
  }

  async findAll<Role>(
    data: PartialRoleType,
    listOptions?: addListOptionsDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Role[]> {
    return await this.roleRepository.findAll(data, listOptions);
  }

  async findOne<Role>(
    data: PartialRoleType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Role> {
    const role = await this.roleRepository.findOne<Role>(data);
    if (!role && serviceOptions?.error)
      throw new NotFoundException(RoleMessagesEnum.ROLE_NOT_FOUND);
    // if (!role) return null;/

    return role;
  }

  async remove<Role>(
    data: PartialRoleType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<void> {
    await this.roleRepository.remove(data);
  }

  async update<Role>(
    findData: PartialRoleType,
    updateData: PartialRoleType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Role> {
    if (updateData.name) {
      const duplicate = await this.findOne(
        { name: updateData.name },
        { show: 'all' },
      );

      if (duplicate && serviceOptions.error) {
        throw new ConflictException(RoleMessagesEnum.ROLE_NAME_CONFLICT);
      } else if (duplicate) {
        return;
      }
    }

    return await this.roleRepository.update(
      findData,
      updateData,
      serviceOptions,
    );
  }
}
