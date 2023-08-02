import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './controllers/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import { UserSchema } from './schema/users.schema';
import { UsersAdminController } from './controllers/admin.users.controller';
import { UsersRepository } from './users.repository';
import { RolesService } from '../roles/roles.service';
import { Role, RoleSchema } from '../roles/schema/roles.schema';
import { RolesRepository } from '../roles/roles.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [UsersController, UsersAdminController],
  providers: [UsersService, UsersRepository, RolesService, RolesRepository],
  exports: [UsersService],
})
export class UsersModule {}
