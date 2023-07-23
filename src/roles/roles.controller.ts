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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { UpdateRoleDto } from './dto/request/update-role.dto';
import { FindRoleDto } from './dto/request/find-role.dto';
import { CreateUserRoleDto } from './dto/request/create-user-role.dto';
import { RemoveUserRoleDto } from './dto/request/remove-user-role.dto';
import { ResponseAfterCreateDto } from '../common/dto/response-after-create.dto';
import { RolesGuard } from '../auth/strategy/role.strategy';
import { RolesEnum } from '../common/enums/roles.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Roles(RolesEnum.ADMIN)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('create')
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<ResponseAfterCreateDto> {
    const exist = await this.findOne(createRoleDto);
    if (exist) throw new ConflictException();

    return await this.rolesService.create(createRoleDto, true);
  }

  @Get('list')
  findAll() {
    return this.rolesService.findAll({});
  }

  @Get('info')
  async findOne(@Query() data: FindRoleDto) {
    return await this.rolesService.findOne(data, true);
  }

  @Patch('update')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete('remove')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  // @Post('user/create')
  // async createUserRole(@Body() data: CreateUserRoleDto) {
  //   return await this.rolesService.createUserRole(data, true);
  // }

  // @Delete('user/remove')
  // async removeUserRole(@Body() data: RemoveUserRoleDto) {
  //   return await this.rolesService.createUserRole(data, true);
  // }
}
