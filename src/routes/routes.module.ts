import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './controllers/routes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Route, RouteSchema } from './schema/routes.schema';
import { RoutesRepository } from './routes.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]),
  ],
  controllers: [RoutesController],
  providers: [RoutesService, RoutesRepository],
})
export class RoutesModule {}
