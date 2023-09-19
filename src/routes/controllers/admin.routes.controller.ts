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
  Query,
} from '@nestjs/common';
import { RoutesService } from '../routes.service';
import { UpdateRouteDto } from '../dto/request/update-route.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ChangeRouteRoleDto } from '../dto/request/change-role.dto';
import { addListOptionsDto } from 'src/common/dto/base-repository-dtos.dto';
import { Route } from '../schema/routes.schema';
import { RouteListRequestDto } from '../dto/request/find-route.dto';
import { RouteListResponse } from '../dto/response/route-list-response.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('routes/admin')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @ApiOperation({ summary: 'Update route' })
  @ApiBody({ type: UpdateRouteDto })
  @Patch('update')
  async update(@Body() updateRouteDto: UpdateRouteDto) {
    const findData = { id: updateRouteDto.id };
    delete updateRouteDto.id;
    return await this.routesService.update(findData, updateRouteDto, {
      error: true,
    });
  }

  @ApiOperation({ summary: 'Get template list' })
  @Get('list')
  async findAll(
    @Query() listOptions: addListOptionsDto,
    @Query() data: RouteListRequestDto,
  ): Promise<Array<Route>> {
    const result = await this.routesService.findAll<Route>(data, listOptions);
    return result.map((item) => new RouteListResponse(item));
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
