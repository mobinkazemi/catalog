import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/schema/users.schema';
import { FindUserResponseDto } from '../users/dto/response/findOne-user.dto';
import { RedisProxyService } from '../redis/redis.service';
import { defaults } from '../../config/defaults';
import { AUTH_ERROR_MESSAGE_ENUMS } from './eunms/auth-error-response.enums';
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

    const paired = await bcrypt.compare(password, user.password);
    if (!paired) return undefined;

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
    const oldSessionId = req.user.payload.sessionId;
    const newSessionId = Math.ceil(Date.now() * Math.random());

    const refreshToken = this.getTokenFromHeader(req);

    const user = await this.userService.findOne({
      id: userId,
    });

    if (!user) {
      throw new BadRequestException(AUTH_ERROR_MESSAGE_ENUMS.NO_SESSION);
    }

    const result = await this.loginWithCredentials(user);

    try {
      await this.redisService.refSession(
        userId,
        refreshToken,
        result.accessToken,
        result.refreshToken,
        oldSessionId,
        newSessionId,
      );
    } catch (error) {
      throw new BadRequestException(AUTH_ERROR_MESSAGE_ENUMS.NO_SESSION);
    }

    return result;
  }

  async logout(req: any) {
    const userId = req.user.payload.userId;
    const sessionId = req.user.payload.sessionId;

    const accessToken = this.getTokenFromHeader(req);

    try {
      await this.redisService.delSession(userId, accessToken, sessionId);
    } catch (error) {
      throw new BadRequestException(AUTH_ERROR_MESSAGE_ENUMS.NO_SESSION);
    }
  }

  async loginWithCredentials(user: any) {
    user = new FindUserResponseDto(user);
    const sessionId = Math.ceil(Date.now() * Math.random());

    const payload = {
      sub: user._id.toString(),
      roles: user.roles || [],
      sessionId,
    };
    const result = {
      ...user,
      accessToken: this.jwt.sign(payload, {
        secret: this.configService.getOrThrow('jwtSecret'),
        expiresIn: this.configService.getOrThrow('accessJwtExpire'),
      }),
      refreshToken: this.jwt.sign(payload, {
        secret: this.configService.getOrThrow('jwtSecret'),
        expiresIn: this.configService.getOrThrow('refreshJwtExpire'),
      }),
    };

    await this.redisService.setSession(
      user._id,
      result.accessToken,
      result.refreshToken,
      sessionId,
    );

    return result;
  }
}
