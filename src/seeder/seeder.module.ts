import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from 'src/roles/roles.module';
import { RolesService } from 'src/roles/roles.service';
import { Role, RoleSchema } from 'src/roles/schema/roles.schema';
import { User, UserSchema } from 'src/users/schema/users.schema';
import { UsersModule } from 'src/users/users.module';
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
