import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/schema/users.schema';
import { FindUserResponseDto } from 'src/users/dto/response/findOne-user.dto';
import { RedisProxyService } from 'src/redis/redis.service';
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

  async loginWithCredentials(user: any) {
    user = new FindUserResponseDto(user);
    const sessionId = Math.ceil(Date.now() * Math.random());
    const payload = { sub: user.id, roles: user.roles || [], sessionId };
    const result = {
      ...user,
      accessToken: this.jwt.sign(payload, {
        secret: this.configService.get('jwtSecret'),
        expiresIn: this.configService.get('accessJwtExpire'),
      }),
      refreshToken: this.jwt.sign(payload, {
        secret: this.configService.get('jwtSecret'),
        expiresIn: this.configService.get('refreshJwtExpire'),
      }),
    };

    // console.log('me', result.accessToken, result.refreshToken);

    await this.redisService.setSession(
      user.id,
      result.accessToken,
      result.refreshToken,
      sessionId,
    );

    return result;
  }
}
