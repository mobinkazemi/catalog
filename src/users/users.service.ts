import {
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { FindUserDto } from './dto/request/findone-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { User } from './schema/users.schema';
import { ResponseAfterCreateDto } from '../common/dto/response-after-create.dto';
import { FilterRequestUserDto } from './dto/request/filter-user.dto';
import { UsersRepository } from './users.repository';
import { ChangeUserRoleDto } from './dto/request/change-user-role.dto';
import { RolesService } from '../roles/roles.service';
import { addListOptionsDto } from 'src/common/dto/base-repository-dtos.dto';
import * as bcrypt from 'bcrypt';
import { BaseSchemaDto } from 'src/database/dto/base.dto';
import { ObjectIdOrString } from 'src/common/types/types';
import { ServiceOptionsDto } from 'src/common/dto/service-options.dto';
import { UserMessagesEnum } from './enums/messages.enum';
import { UserPartialType } from './types/partial-user.type';
import { Role } from 'src/roles/schema/roles.schema';
import { BaseService } from 'src/common/services/base.service';
@Injectable()
export class UsersService extends BaseService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly roleService: RolesService,
  ) {
    super();
  }
  async create<User>(
    data: UserPartialType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<User> {
    const duplicateUsername = await this.userRepository.findOne(
      {
        username: data.username,
      },
      { show: 'all' },
    );

    if (duplicateUsername && serviceOptions?.error) {
      //TODO msg
      throw new ConflictException();
    }
    if (duplicateUsername) return;

    const result = await this.userRepository.create<User>(data);

    return result;
  }

  async findAll<User>(
    data: UserPartialType,
    listOptions?: addListOptionsDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<User[]> {
    const result: User[] = await this.userRepository.findAll(
      data,
      listOptions,
      serviceOptions,
    );
    return result;
  }

  async findOne<User>(
    data: UserPartialType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<User> {
    const result: User = await this.userRepository.findOne(
      data,
      serviceOptions,
    );

    if (!result && serviceOptions?.error) {
      throw new NotFoundException(UserMessagesEnum.USER_NOT_FOUND);
    }

    return result;
  }

  async update<User>(
    findData: UserPartialType,
    updateData: UserPartialType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<User> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 8);
    }

    const result = await this.userRepository.update<User>(
      findData,
      updateData,
      serviceOptions,
    );

    return result;
  }

  async remove<User>(
    data: UserPartialType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<void> {
    await this.userRepository.remove(data);
  }

  async addRole(
    data: ChangeUserRoleDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<User> {
    const user = await this.findOne<User>(
      { id: data.userId },
      { error: serviceOptions.error },
    );
    const role = await this.roleService.findOne<Role>(
      { id: data.roleId },
      { error: serviceOptions.error },
    );

    if ((!user || !role) && !serviceOptions.error) return;

    const rolesList = [...new Set([role.name, ...user.roles])];

    const result = await this.userRepository.update<User>(
      {
        id: data.userId,
      },
      { roles: rolesList },
    );

    return result;
  }

  async removeRole(
    data: ChangeUserRoleDto,
    serviceOptions?: ServiceOptionsDto,
  ) {
    const user = await this.findOne<User>(
      { id: data.userId },
      { error: serviceOptions.error },
    );
    const role = await this.roleService.findOne<Role>(
      { id: data.roleId },
      { error: serviceOptions.error },
    );

    if ((!user || !role) && !serviceOptions.error) return;

    const rolesList = user.roles.filter((r) => r != role.name);

    const result = await this.userRepository.update<User>(
      {
        id: data.userId,
      },
      { roles: rolesList },
    );

    return result;
  }
}
