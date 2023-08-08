import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import configuration from 'config/configuration';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisProxyService } from '../../redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly redisService: RedisProxyService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('jwtSecret'),
      ignoreExpiration: false,
      // passReqToCallback: true,
    });
  }

  async validate(payload: any) {
    await this.isLoggedIn(payload.sub, payload.sessionId);

    return {
      payload: {
        userId: payload.sub,
        roles: payload.roles,
        sessionId: payload.sessionId,
      },
    };
  }

  async isLoggedIn(userId: string, sessionId: number) {
    const result = await this.redisService.hasSession(userId, { sessionId });

    if (!result) {
      throw new UnauthorizedException();
    }
  }
}
