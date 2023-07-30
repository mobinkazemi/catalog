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
import { ApiProperty } from '@nestjs/swagger';
import {
  FilterRequestUserDto,
  UserResponseListDto,
} from '../dto/request/filter-user.dto';
import { addListOptionsDto } from 'src/common/dto/base-repository-dtos.dto';
import { UpdateUserPaswordDto } from '../dto/request/update-user.dto';
import { userWithoutPasswordDto } from '../dto/response/findOne-user.dto';
import { User } from '../schema/users.schema';

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
    @Query() listOptions: addListOptionsDto,
    @Query() data: FilterRequestUserDto,
  ): Promise<Array<UserResponseListDto>> {
    return (await this.usersService.findAll(data, listOptions)).map(
      (item) => new UserResponseListDto(item),
    );
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserPaswordDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    return new userWithoutPasswordDto(user as User);
  }

  @Delete('remove')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
