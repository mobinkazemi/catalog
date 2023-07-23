import {
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/request/create-user.dto';
import { FindUserDto } from './dto/request/findone-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { User } from './schema/users.schema';
import { UserDocument } from './schema/users.schema';
import { ResponseAfterCreateDto } from '../common/dto/response-after-create.dto';
import {
  UserResponseListDto,
  FilterRequestUserDto,
} from './dto/request/filter-user.dto';
import { UsersRepository } from './users.repository';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly userRepository: UsersRepository,
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
}
