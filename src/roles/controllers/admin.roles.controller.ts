import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ConflictException,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from '../roles.service';
import { CreateRoleDto } from '../dto/request/create-role.dto';
import { FindRoleDto } from '../dto/request/find-role.dto';
import { ResponseAfterCreateDto } from '../../common/dto/response-after-create.dto';
import { RolesGuard } from '../../auth/strategy/role.strategy';
import { RolesEnum } from '../../common/enums/roles.enum';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { addListOptionsDto } from '../../common/dto/base-repository-dtos.dto';
import { FindRolesListDto } from '../dto/request/find-roles.dto';
import { ApiOperation } from '@nestjs/swagger';

@UseGuards(RolesGuard)
@Roles(RolesEnum.ADMIN)
@UseGuards(AuthGuard('jwt'))
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'create new role' })
  @Post('create')
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<ResponseAfterCreateDto> {
    return await this.rolesService.create(createRoleDto, true);
  }

  @ApiOperation({ summary: 'find role list' })
  @Get('list')
  async findAll(
    @Query() listOptions: addListOptionsDto,
    @Query() data: FindRolesListDto,
  ) {
    return await this.rolesService.findAll(data, listOptions);
  }

  @Get('find one role')
  async findOne(@Query() data: FindRoleDto) {
    return await this.rolesService.findOne(data, true);
  }

  @ApiOperation({ summary: 'remove one role' })
  @Delete('remove')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}