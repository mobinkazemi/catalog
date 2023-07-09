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
import { CreateResponseDto } from 'src/common/dto/create-response.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async create(createUserDto: CreateUserDto, error?:boolean):Promise<CreateResponseDto> {
    const result = await this.userModel.create(createUserDto);
    return new CreateResponseDto(result);
  }

  async findAll() {
    const users = await this.userModel.find()
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
