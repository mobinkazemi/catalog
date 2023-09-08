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
@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly roleService: RolesService,
  ) {}
  async create(
    createUserDto: CreateUserDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<ResponseAfterCreateDto> {
    const duplicateUsername = await this.userRepository.findOne(
      {
        username: createUserDto.username,
      },
      { show: 'all' },
    );

    if (duplicateUsername && serviceOptions?.error) {
      throw new ConflictException();
    }
    if (duplicateUsername) return;

    const result = await this.userRepository.create(createUserDto);

    return new ResponseAfterCreateDto(result);
  }

  async findAll(
    data?: FilterRequestUserDto,
    listOptions?: addListOptionsDto,
  ): Promise<Array<User>> {
    const result: User[] = await this.userRepository.findAll(data, listOptions);
    return result;
  }

  async findOne(
    data: FindUserDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<User> {
    const result: User = await this.userRepository.findOne(data);

    if (!result && serviceOptions?.error) {
      throw new NotFoundException(UserMessagesEnum.USER_NOT_FOUND);
    }

    return result;
  }

  async update(id: string, updateUserDto: UserPartialType) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 8);
    }

    const result = await this.userRepository.updateOne({ id }, updateUserDto);

    return result;
  }

  async remove(id: ObjectIdOrString, serviceOptions?: ServiceOptionsDto) {
    await this.findOne({ id: id.toString() }, serviceOptions);

    await this.userRepository.remove(id);
  }

  async addRole(
    data: ChangeUserRoleDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<User> {
    const user = await this.findOne(
      { id: data.userId },
      { error: serviceOptions.error },
    );
    const role = await this.roleService.findOne<Role>(
      { id: data.roleId },
      { error: serviceOptions.error },
    );

    if ((!user || !role) && !serviceOptions.error) return;

    const rolesList = [...new Set([role.name, ...user.roles])];
    console.log(rolesList);

    const result = await this.userRepository.updateOne<User>(
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
    const user = await this.findOne(
      { id: data.userId },
      { error: serviceOptions.error },
    );
    const role = await this.roleService.findOne<Role>(
      { id: data.roleId },
      { error: serviceOptions.error },
    );

    if ((!user || !role) && !serviceOptions.error) return;

    const rolesList = user.roles.filter((r) => r != role.name);

    const result = await this.userRepository.updateOne<User>(
      {
        id: data.userId,
      },
      { roles: rolesList },
    );

    return result;
  }
}
