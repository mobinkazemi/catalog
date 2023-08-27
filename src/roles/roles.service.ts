import {
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceOptionsDto } from 'src/common/dto/service-options.dto';
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
import { RolesRepository } from './roles.repository';
import { Role, RoleDocument } from './schema/roles.schema';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RolesRepository) {}
  async create(
    createRoleDto: CreateRoleDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<ResponseAfterCreateDto> {
    const duplicate = await this.roleRepository.findOne(
      {
        name: createRoleDto.name,
      },
      { show: 'all' },
    );
    if (duplicate && serviceOptions?.error) throw new ConflictException();
    if (duplicate) return;

    const result = await this.roleRepository.create({
      ...createRoleDto,
    });

    return new ResponseAfterCreateDto(result);
  }

  async findAll(
    data?: FindRolesListDto,
    listOptions?: addListOptionsDto,
  ): Promise<Role[]> {
    return await this.roleRepository.findAll(data, listOptions);
  }

  async findOne(
    data: FindRoleDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Role> {
    const role = await this.roleRepository.findOne<Role>(data);
    if (!role && serviceOptions?.error) throw new NotFoundException();
    // if (!role) return null;/

    return role;
  }

  async remove(data: findByIdDto, serviceOptions?: ServiceOptionsDto) {
    await this.findOne({ id: data.id }, serviceOptions);

    await this.roleRepository.remove(data);
  }
}
