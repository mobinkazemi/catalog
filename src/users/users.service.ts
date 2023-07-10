import {  Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/request/create-user.dto';
import { FindUserDto } from './dto/request/findone-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { User } from './schema/users.schema'
import { UserDocument } from './schema/users.schema';
import { ResponseAfterCreateDto } from 'src/common/dto/response-after-create.dto';
import { FilterUserDto } from './dto/request/filter-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async create(createUserDto: CreateUserDto, error?:boolean):Promise<ResponseAfterCreateDto> {
    const result = await this.userModel.create(createUserDto);
    return new ResponseAfterCreateDto(result);
  }

  async findAll(data?:FilterUserDto): Promise<Array<FilterUserDto>> {
    const users = await this.userModel.find()

    return users.map(item => new FilterUserDto(item))
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
