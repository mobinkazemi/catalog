import { ConflictException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/request/create-user.dto';
import { FindUserDto } from './dto/request/findone-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { User } from './schema/users.schema'
import { UserDocument } from './schema/users.schema';
import * as bcrypt from 'bcryptjs'
import { FindUserResponseDto } from './dto/response/findOne-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  
  async validateUser(username:string,password:string):Promise<boolean>{
    const user = await this.findOne({username})
    if(!user) return false;

    try {
      await bcrypt.compare(password, user.password);
      return true;
    } catch (error) {
      return false
    }
  }

  async create(createUserDto: CreateUserDto) {
    const exist = await this.findOne({username: createUserDto.username});
    if(exist) throw new ConflictException()
    const result = await this.userModel.create(createUserDto);
    return result.id;
  }

  findAll() {
    throw new NotImplementedException();
  }

  async findOne({id,username}:FindUserDto, error?:boolean):Promise<User> {
    let user:User;

    if(id) {
      user = await this.userModel.findById(id);
    }else {
      user = await this.userModel.findOne({username});
    }

    if(!user && error) throw new NotFoundException();

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    throw new NotImplementedException();
  }

  async remove(id: number) {
    throw new NotImplementedException();
  }
}
