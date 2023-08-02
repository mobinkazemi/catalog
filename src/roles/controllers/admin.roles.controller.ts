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
  NotImplementedException,
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
import { ApiBody, ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { findRoleResponseDto } from '../dto/response/find-role.dto';

@UseGuards(RolesGuard)
@Roles(RolesEnum.ADMIN)
@UseGuards(AuthGuard('jwt'))
@Controller('roles/admin')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiBody({ type: CreateRoleDto })
  @ApiOperation({ summary: 'Create role' })
  @Post('create')
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<ResponseAfterCreateDto> {
    return await this.rolesService.create(createRoleDto, true);
  }

  @ApiOperation({ summary: 'Get role list' })
  @Get('list')
  async findAll(
    @Query() listOptions: addListOptionsDto,
    @Query() data: FindRolesListDto,
  ) {
    return (await this.rolesService.findAll(data, listOptions)).map(
      (item) => new findRoleResponseDto(item),
    );
  }

  @ApiOperation({ summary: 'Get role info' })
  @Get('info')
  async findOne(@Query() data: FindRoleDto) {
    const result = await this.rolesService.findOne(data, true);
    return new findRoleResponseDto(result);
  }

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Delete role' })
  @Delete('remove/:id')
  remove(@Param() id: string) {
    throw new NotImplementedException();
  }
}
