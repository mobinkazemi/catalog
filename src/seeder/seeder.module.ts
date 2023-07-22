import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from '../roles/roles.module';
import { RolesService } from '../roles/roles.service';
import { Role, RoleSchema } from '../roles/schema/roles.schema';
import { User, UserSchema } from '../users/schema/users.schema';
import { UsersModule } from '../users/users.module';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
