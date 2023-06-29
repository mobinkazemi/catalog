import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserDocument } from './schema/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  create(createUserDto: CreateUserDto) {
    this.userModel.create({
      username: 'testtsttest',
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId('649d7da4f33a5a61a4bac9aa'),
        // id: new mongoose.Types.ObjectId('649d7da4f33a5a61a4bac9aa'),
      },
      {
        $set: { username: 'testtsttest_new2' },
        username: 'me',
      },
    );
  }

  async remove(id: number) {
    await this.userModel.updateMany(
      {
        _id: new mongoose.Types.ObjectId('649d7da4f33a5a61a4bac9aa'),
      },
      {
        deletedAt: new Date(),
      },
    );
  }
}
