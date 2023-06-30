import { ConflictException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { UpdateRoleDto } from './dto/request/update-role.dto';
import { Role, RoleDocument } from './schema/roles.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {}
  async create(createRoleDto: CreateRoleDto, error?: boolean) {
    const exist = await this.findOne(createRoleDto);

    if(exist && error) throw new ConflictException();
    if(exist) return null;

    const result = await this.roleModel.create(createRoleDto);
    return result;
  }

  findAll() {
    throw new NotImplementedException();
  }

  async findOne({ id, name }: { id?: string; name?: string }, error?:boolean) {
    let role: Role;
    if (id) {
      role = await this.roleModel.findById(id);
    } else {
      role = await this.roleModel.findOne({ name });
    }

    if(!role && error) throw new NotFoundException()
    if(!role) return null;

    return role;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    throw new NotImplementedException();
  }

  remove(id: number) {
    throw new NotImplementedException();
  }
}
