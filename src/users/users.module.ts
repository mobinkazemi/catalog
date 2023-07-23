import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './controller/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import { UserSchema } from './schema/users.schema';
import { UsersAdminController } from './controller/admin.users.controller';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController, UsersAdminController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
