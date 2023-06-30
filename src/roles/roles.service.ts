import { ConflictException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schema/users.schema';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { CreateUserRoleDto } from './dto/request/create-user-role.dto';
import { RemoveUserRoleDto } from './dto/request/remove-user-role.dto';
import { UpdateRoleDto } from './dto/request/update-role.dto';
import { Role, RoleDocument } from './schema/roles.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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

  async createUserRole(data:CreateUserRoleDto, error?:boolean){
    await this.userModel.updateOne({
      _id: new mongoose.Types.ObjectId(data.userId),
    }, {
      $addToSet: {roles: new mongoose.Types.ObjectId(data.roleId)}
    });
  }

  async removeUserRole(data:RemoveUserRoleDto, error?:boolean){
    await this.userModel.updateOne({
      _id: new mongoose.Types.ObjectId(data.userId),
    }, {
      $pull: {roles: new mongoose.Types.ObjectId(data.roleId)}
    });
  }
}
