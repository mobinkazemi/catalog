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
import { RedisProxyService } from 'src/redis/redis.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UsersService,
    private readonly redisService: RedisProxyService,
  ) {}

  private getTokenFromHeader(req) {
    const rawHeaders = req.rawHeaders;
    const keyIdx = rawHeaders.indexOf('Authorization');
    const valueIdx = keyIdx + 1;

    const token = rawHeaders[valueIdx].split(' ')[1];
    return token;
  }
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    return await this.authService.loginWithCredentials(req.user);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt'))
  async refresh(@Request() req) {
    const userId = req.user.payload.userId;
    const refreshToken = this.getTokenFromHeader(req);

    const user = await this.userService.findOne({
      id: userId,
    });

    const result = await this.authService.loginWithCredentials(user);

    const sessionId = Math.ceil(Date.now() * Math.random());

    try {
      await this.redisService.refSession(
        userId,
        refreshToken,
        result.accessToken,
        result.refreshToken,
        sessionId,
      );
    } catch (error) {
      throw new BadRequestException('اطلاعات لاگین پیدا نشد');
    }

    return result;
  }
}
