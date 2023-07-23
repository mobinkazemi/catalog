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
import { CreateUserRoleDto } from '../roles/dto/request/create-user-role.dto';
import { RolesService } from '../roles/roles.service';
import { RemoveUserRoleDto } from '../roles/dto/request/remove-user-role.dto';
import { Role } from 'src/roles/schema/roles.schema';
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
  ): Promise<Array<UserResponseListDto>> {
    const result: User[] = await this.userRepository.findAll(data);
    return result.map((item) => new UserResponseListDto(item));
  }

  async findOne(data: FindUserDto, error?: boolean): Promise<User> {
    const result: User = await this.userRepository.findOne(data);
    if (!result && error) throw new NotFoundException();
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    throw new NotImplementedException();
  }

  async remove(id: number) {
    throw new NotImplementedException();
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
      { role: rolesList },
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
      { role: rolesList },
    );

    return result;
  }
}
