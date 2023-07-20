import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    return await this.authService.loginWithCredentials(req.user);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt'))
  async refresh(@Request() req) {
    const user = await this.userService.findOne({
      id: req.user.payload.userId,
    });

    return await this.authService.loginWithCredentials(user);
  }
}
