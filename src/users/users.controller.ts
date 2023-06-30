import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { FindUserDto } from './dto/request/findone-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { FindUserResponseDto } from './dto/response/findOne-user.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto, true);
  }

  @Get('list')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('info')
  async findOne(@Query() data:FindUserDto) {
    const {id, username} = data;
    if(!id && !username) throw new BadRequestException()
    return new FindUserResponseDto( await this.usersService.findOne({id,username}));
  }

  @Patch('update')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('remove')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
