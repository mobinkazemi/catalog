import { RedisManager, RedisService } from '@liaoliaots/nestjs-redis';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { RedisProxyService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import configuration from '../../config/configuration';

const mockUserService = () => ({});
const mockRedisProxy = () => ({
  setSession: async () => {},
});

const loginStubs = {
  user: {
    _id: 'mock id',
    username: 'mock username',
    createdAt: new Date(),
    updatedAt: new Date(),
    roles: [],
  },
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [`${process.env.NODE_ENV}.env`],
          load: [configuration],
        }),
      ],
    }).compile();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        ConfigService,
        {
          provide: RedisProxyService,
          useFactory: mockRedisProxy,
        },
        {
          provide: UsersService,
          useFactory: mockUserService,
        },
      ],
      controllers: [AuthController],
    }).compile();
    require('dotenv').config();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Login API', () => {
    let result;

    beforeEach(async () => {
      result = await controller.login(loginStubs);
    });

    it("should return user's id", async () => {
      expect(result.id).toBeDefined();
    });
    it('should return username', async () => {
      expect(result.username).toBeDefined();
    });
    it('should return roles', async () => {
      expect(result.roles).toBeDefined();
    });
    it('should return accessToken', async () => {
      expect(result.accessToken).toBeDefined();
    });
    it('should return refreshToken', async () => {
      expect(result.refreshToken).toBeDefined();
    });
  });
});
