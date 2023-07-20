import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { FindUserDto } from '../dto/request/findone-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { FindUserResponseDto } from '../dto/response/findOne-user.dto';
import { ResponseAfterCreateDto } from 'src/common/dto/response-after-create.dto';
import { RolesGuard } from 'src/auth/strategy/role.strategy';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  FilterRequestUserDto,
  UserResponseListDto,
} from '../dto/request/filter-user.dto';

@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@Controller('users/admin')
@UseGuards(AuthGuard('jwt'))
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  @ApiProperty({ type: CreateUserDto })
  @Post('create')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseAfterCreateDto> {
    const exist = await this.usersService.findOne({
      username: createUserDto.username,
    });
    if (exist) throw new ConflictException();

    return await this.usersService.create(createUserDto, true);
  }

  @Get('list')
  async findAll(
    @Query() data: FilterRequestUserDto,
  ): Promise<Array<UserResponseListDto>> {
    return await this.usersService.findAll(data);
  }
}
