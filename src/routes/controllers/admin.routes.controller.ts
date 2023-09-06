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
import { UpdateRouteDto } from '../dto/request/update-route.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ChangeRouteRoleDto } from '../dto/request/change-role.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('routes/admin')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}
  @ApiOperation({ summary: 'Update route' })
  @ApiBody({ type: UpdateRouteDto })
  @Patch('update')
  async update(@Body() updateRouteDto: UpdateRouteDto) {
    return await this.routesService.update(updateRouteDto, { error: true });
  }

  @ApiOperation({ summary: 'add role to route' })
  @ApiBody({ type: ChangeRouteRoleDto })
  @Patch('role/add')
  async addRole(@Body() data: ChangeRouteRoleDto) {
    return await this.routesService.addRole(data, { error: true });
  }

  @ApiOperation({ summary: 'remove role from route' })
  @ApiBody({ type: ChangeRouteRoleDto })
  @Patch('role/remove')
  async removeRole(@Body() data: ChangeRouteRoleDto) {
    return await this.routesService.removeRole(data, { error: true });
  }
}
