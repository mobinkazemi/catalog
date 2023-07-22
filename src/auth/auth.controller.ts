import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisProxyService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UsersService,
    private readonly redisService: RedisProxyService,
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    return await this.authService.loginWithCredentials(req.user);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt'))
  async refresh(@Request() req) {
    return await this.authService.refreshToken(req);
  }
}
