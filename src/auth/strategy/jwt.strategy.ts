import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisProxyService } from '../../redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly redisService: RedisProxyService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
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
