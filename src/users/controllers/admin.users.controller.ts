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
  Req,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ResponseAfterCreateDto } from '../../common/dto/response-after-create.dto';
import { RolesGuard } from '../../auth/strategy/role.strategy';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesEnum } from '../../common/enums/roles.enum';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
} from '@nestjs/swagger';
import {
  FilterRequestUserDto,
  UserResponseListDto,
} from '../dto/request/filter-user.dto';
import {
  addListOptionsDto,
  findByIdDto,
} from 'src/common/dto/base-repository-dtos.dto';
import {
  UpdateUserDto,
  UpdateUserByAdminDto,
} from '../dto/request/update-user.dto';
import {
  FindUserResponseDto,
  userWithoutPasswordDto,
} from '../dto/response/findOne-user.dto';
import { User } from '../schema/users.schema';
import { BaseSchemaDto } from 'src/database/dto/base.dto';
import { ObjectIdOrString } from 'src/common/types/types';
import { RemoveUserDto } from '../dto/request/remove-user-dto';
import { FindUserDto } from '../dto/request/findone-user.dto';
import mongoose from 'mongoose';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';

@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@Controller('users/admin')
@UseGuards(AuthGuard('jwt'))
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
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

  @ApiOperation({ summary: 'Get user info' })
  @ApiParam(findByIdDto)
  @Get('info/:id')
  async findOne(@Param() data: findByIdDto) {
    const { id } = data;

    const result = await this.usersService.findOne({ id });

    return new FindUserResponseDto(result);
  }

  @ApiQuery({ type: addListOptionsDto })
  @ApiQuery({ type: FilterRequestUserDto })
  @ApiOperation({ summary: 'Get user list' })
  @Get('list')
  async findAll(
    @Query() listOptions: addListOptionsDto,
    @Query() data: FilterRequestUserDto,
  ): Promise<Array<UserResponseListDto>> {
    return (await this.usersService.findAll(data, listOptions)).map(
      (item) => new UserResponseListDto(item),
    );
  }

  @ApiParam(findByIdDto)
  @ApiBody({ type: UpdateUserByAdminDto })
  @ApiOperation({ summary: 'Update user' })
  @Patch('update/:id')
  async update(
    @Param() idData: findByIdDto,
    @Body() updateUserDto: UpdateUserByAdminDto,
  ) {
    const user = await this.usersService.update(idData.id, updateUserDto);
    return new userWithoutPasswordDto(user as User);
  }

  @ApiBody({ type: RemoveUserDto })
  @ApiOperation({ summary: 'Delete user' })
  @Delete('remove')
  remove(@Body() data: RemoveUserDto) {
    return this.usersService.remove(data.id, true);
  }
}
