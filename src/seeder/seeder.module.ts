import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisProxyService } from 'src/redis/redis.service';
import { RoutesRepository } from 'src/routes/routes.repository';
import { RoutesService } from 'src/routes/routes.service';
import { Route, RouteSchema } from 'src/routes/schema/routes.schema';
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
      { name: Route.name, schema: RouteSchema },
    ]),
  ],
  providers: [
    SeederService,
    RedisProxyService,
    RoutesService,
    RoutesRepository,
  ],
})
export class SeederModule {}
