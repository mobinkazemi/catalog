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
import { UpdateUserPaswordDto } from '../dto/request/update-user.dto';
import { FindUserDto } from '../dto/request/findone-user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  FindUserResponseDto,
  userWithoutPasswordDto,
} from '../dto/response/findOne-user.dto';
import { User } from '../schema/users.schema';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('info')
  async findOne(@Query() data: FindUserDto) {
    const { id, username } = data;
    if (!id && !username) throw new BadRequestException();

    const result = await this.usersService.findOne({ id, username });

    return new FindUserResponseDto(result);
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
