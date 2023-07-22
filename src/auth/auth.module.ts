import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RedisProxyService } from '../redis/redis.service';
import { RedisProxyModule } from '../redis/redis.module';

@Module({
  imports: [ConfigModule, UsersModule, PassportModule, RedisProxyModule],
  providers: [
    AuthService,
    LocalStrategy,
    JwtService,
    JwtStrategy,
    RedisProxyService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
