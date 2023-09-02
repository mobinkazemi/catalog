import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './controllers/admin.routes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Route, RouteSchema } from './schema/routes.schema';
import { RoutesRepository } from './routes.repository';
import { RolesService } from 'src/roles/roles.service';
import { RolesRepository } from 'src/roles/roles.repository';
import { Role, RoleSchema } from 'src/roles/schema/roles.schema';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]),
    RolesModule,
  ],
  controllers: [RoutesController],
  providers: [RoutesService, RoutesRepository],
})
export class RoutesModule {}
