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
import {
  UserResponseListDto,
  FilterRequestUserDto,
} from './dto/request/filter-user.dto';
import { UsersRepository } from './users.repository';
import { CreateUserRoleDto } from './dto/request/create-user-role.dto';
import { RolesService } from '../roles/roles.service';
import { RemoveUserRoleDto } from '../roles/dto/request/remove-user-role.dto';
import { Role } from 'src/roles/schema/roles.schema';
import { addListOptionsDto } from 'src/common/dto/base-repository-dtos.dto';
import * as bcrypt from 'bcrypt';
import { UpdateRoleDto } from 'src/roles/dto/request/update-role.dto';
import { BaseSchemaDto } from 'src/database/dto/base.dto';
import { ObjectIdOrString } from 'src/common/types/types';
@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly roleService: RolesService,
  ) {}
  async create(
    createUserDto: CreateUserDto,
    error?: boolean,
  ): Promise<ResponseAfterCreateDto> {
    const duplicateUsername = await this.userRepository.findOne(
      {
        username: createUserDto.username,
      },
      { show: 'all' },
    );

    if (duplicateUsername && error) throw new ConflictException();
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

  async findOne(data: FindUserDto, error?: boolean): Promise<User> {
    const result: User = await this.userRepository.findOne(data);
    if (!result && error) throw new NotFoundException();
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto & BaseSchemaDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 8);
    }
    console.log({ id });
    console.log({ updateUserDto });

    return await this.userRepository.updateOne({ id }, updateUserDto);
  }

  async remove(id: ObjectIdOrString, error?: boolean) {
    await this.findOne({ id: id.toString() }, error);

    await this.userRepository.remove(id);
  }

  async addRole(data: CreateUserRoleDto, error?: boolean): Promise<User> {
    const user = await this.userRepository.findOne<User>({ id: data.userId });
    const role = await this.roleService.findOne({ id: data.roleId });

    if (error && !user) throw new NotFoundException();
    if (!user) return;
    if (error && !role) throw new NotFoundException();
    if (!role) return;

    const rolesList = [...new Set([role.name, ...user.roles])];
    const result = await this.userRepository.updateOne<User>(
      {
        id: data.userId,
      },
      { role: rolesList } as UpdateUserDto,
    );

    return result;
  }

  async removeRole(data: RemoveUserRoleDto, error?: boolean) {
    const user = await this.userRepository.findOne<User>({ id: data.userId });
    const role = await this.roleService.findOne({ id: data.roleId });

    if (error && !user) throw new NotFoundException();
    if (!user) return;
    if (error && !role) throw new NotFoundException();
    if (!role) return;

    const rolesList = user.roles.filter((r) => r != role.name);

    const result = await this.userRepository.updateOne<User>(
      {
        id: data.userId,
      },
      { role: rolesList } as UpdateUserDto,
    );

    return result;
  }
}
