import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotImplementedException,
  UseGuards,
} from '@nestjs/common';
import { RoutesService } from '../routes.service';
import { UpdateRouteDto } from '../dto/update-route.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Patch('update')
  async update(@Body() updateRouteDto: UpdateRouteDto) {
    return await this.routesService.update(updateRouteDto, { error: true });
  }
}
