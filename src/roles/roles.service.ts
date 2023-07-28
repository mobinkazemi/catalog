import {
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { addListOptionsDto } from '../common/dto/base-repository-dtos.dto';
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
    error?: boolean,
  ): Promise<ResponseAfterCreateDto> {
    const duplicate = await this.roleRepository.findOne({
      name: createRoleDto.name.toUpperCase(),
    });
    if (duplicate && error) throw new ConflictException();
    if (duplicate) return;

    const result = await this.roleRepository.create({
      ...createRoleDto,
      name: createRoleDto.name.toUpperCase(),
    });

    return new ResponseAfterCreateDto(result);
  }

  async findAll(
    data?: FindRolesListDto,
    listOptions?: addListOptionsDto,
  ): Promise<Role[]> {
    return await this.roleRepository.findAll(data, listOptions);
  }

  async findOne(data: FindRoleDto, error?: boolean): Promise<Role> {
    const role = await this.roleRepository.findOne<Role>(data);
    if (!role && error) throw new NotFoundException();
    // if (!role) return null;/

    return role;
  }

  remove(id: number) {
    throw new NotImplementedException();
  }
}
