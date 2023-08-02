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
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { FindUserDto } from '../dto/request/findone-user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  FindUserResponseDto,
  userWithoutPasswordDto,
} from '../dto/response/findOne-user.dto';
import { User } from '../schema/users.schema';
import { GetPayload } from 'src/common/decorators/getUser.decorator';
import { getPayloadDecoratorDto } from '../dto/response/get-user-decorator.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user (self) info' })
  @Get('info')
  async findOne(@Query() data: FindUserDto) {
    const { id, username } = data;
    if (!id && !username) throw new BadRequestException();

    const result = await this.usersService.findOne({ id, username });

    return new FindUserResponseDto(result);
  }

  @ApiOperation({ summary: 'Update user' })
  @Patch('update')
  async update(
    @Body() updateUserDto: Pick<UpdateUserDto, 'password'>,
    @GetPayload() payload: getPayloadDecoratorDto,
  ) {
    const user = await this.usersService.update(payload.id, updateUserDto);
    return new userWithoutPasswordDto(user as User);
  }
}
