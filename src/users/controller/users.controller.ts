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
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { getUserDecoratorDto } from '../dto/response/get-user-decorator.dto';

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

  @Patch('update')
  async update(
    @Body() updateUserDto: UpdateUserPaswordDto,
    @GetUser() requester: getUserDecoratorDto,
  ) {
    const user = await this.usersService.update(requester.id, updateUserDto);
    return new userWithoutPasswordDto(user as User);
  }
}
