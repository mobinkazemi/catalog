import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, UseGuards, ConflictException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { FindUserDto } from '../dto/request/findone-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { FindUserResponseDto } from '../dto/response/findOne-user.dto';
import { CreateResponseDto } from 'src/common/dto/create-response.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('list')
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('info')
  async findOne(@Query() data:FindUserDto) {
    const {id, username} = data;
    if(!id && !username) throw new BadRequestException()

    const result =  await this.usersService.findOne({id, username})
    
    return new FindUserResponseDto(result);
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
