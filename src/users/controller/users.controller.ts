import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, UseGuards, ConflictException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { FindUserDto } from '../dto/request/findone-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { FindUserResponseDto } from '../dto/response/findOne-user.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
