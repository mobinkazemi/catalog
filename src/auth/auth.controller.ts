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
import { ApiOperation } from '@nestjs/swagger';
import { RedisProxyService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    return await this.authService.loginWithCredentials(req.user);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt'))
  async refresh(@Request() req) {
    return await this.authService.refreshToken(req);
  }

  @ApiOperation({ summary: 'Logout' })
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Request() req) {
    return await this.authService.logout(req);
  }
}
