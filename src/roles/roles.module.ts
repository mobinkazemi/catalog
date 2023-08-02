import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './controllers/admin.roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schema/roles.schema';
import { User, UserSchema } from '../users/schema/users.schema';
import { RolesRepository } from './roles.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
  exports: [RolesService],
})
export class RolesModule {}
