import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/schema/users.schema';
import { FindUserResponseDto } from 'src/users/dto/response/findOne-user.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwt: JwtService,
    private configService: ConfigService,
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

    const payload = { sub: user.id };
    return {
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
  }
}
