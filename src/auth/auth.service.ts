import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/schema/users.schema';
import { FindUserResponseDto } from '../users/dto/response/findOne-user.dto';
import { RedisProxyService } from '../redis/redis.service';
import { defaults } from '../../config/configuration';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwt: JwtService,
    private configService: ConfigService,
    private redisService: RedisProxyService,
  ) {}
  async validateUser(
    username: string,
    password: string,
  ): Promise<User> | undefined {
    const user = await this.userService.findOne({ username });
    if (!user) return undefined;

    try {
      await bcrypt.compare(password, user.password);
    } catch (error) {
      return undefined;
    }

    return user;
  }
  private getTokenFromHeader(req) {
    const rawHeaders = req.rawHeaders;
    const keyIdx = rawHeaders.indexOf('Authorization');
    const valueIdx = keyIdx + 1;

    const token = rawHeaders[valueIdx].split(' ')[1];
    return token;
  }

  async refreshToken(req) {
    const userId = req.user.payload.userId;
    const refreshToken = this.getTokenFromHeader(req);

    const user = await this.userService.findOne({
      id: userId,
    });

    const result = await this.loginWithCredentials(user);

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

  async loginWithCredentials(user: any) {
    user = new FindUserResponseDto(user);
    const sessionId = Math.ceil(Date.now() * Math.random());

    const payload = { sub: user.id, roles: user.roles || [], sessionId };
    const result = {
      ...user,
      accessToken: this.jwt.sign(payload, {
        secret: this.configService.get('jwtSecret') || process.env.SECRET,
        expiresIn:
          this.configService.get('accessJwtExpire') || defaults.accessJwtExpire,
      }),
      refreshToken: this.jwt.sign(payload, {
        secret: this.configService.get('jwtSecret') || process.env.SECRET,
        expiresIn:
          this.configService.get('refreshJwtExpire') ||
          defaults.refreshJwtExpire,
      }),
    };

    await this.redisService.setSession(
      user.id,
      result.accessToken,
      result.refreshToken,
      sessionId,
    );

    return result;
  }
}
