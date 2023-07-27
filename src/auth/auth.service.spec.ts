import { RedisManager, RedisService } from '@liaoliaots/nestjs-redis';
import { BadRequestException, INestApplication } from '@nestjs/common';
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
import { AUTH_ERROR_MESSAGE_ENUMS } from './eunms/auth-error-response.enums';

// ---------- STUBS ----------
const loginStubs = {
  user: {
    _id: 'mock id',
    username: 'mock username',
    createdAt: new Date(),
    updatedAt: new Date(),
    roles: [],
  },
};

const correctRefreshStubs = {
  user: {
    payload: {
      userId: 'mock id',
    },
  },
  rawHeaders: ['Athorization', 'mock token'],
};
const wrongRefreshStubs = {
  user: {
    payload: {
      userId: 'mock id wrong',
    },
  },
  rawHeaders: ['Athorization', 'mock token'],
};

// ----------- MOCK SERVICES ------------
const mockUserService = () => ({
  findOne({ id }) {
    if (id == 'mock id') {
      return loginStubs.user;
    } else {
      return undefined;
    }
  },
});

const mockRedisProxy = () => ({
  setSession: async () => {},
  refSession: async () => {},
});

// ----------- TESTS --------------------
describe('AuthService', () => {
  let service: AuthService;

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
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Login With Credentials', () => {
    let result;
    beforeEach(async () => {
      result = await service.loginWithCredentials(loginStubs.user);
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

  describe('refresh token', () => {
    let correctResult;

    beforeEach(async () => {
      correctResult = await service.refreshToken(correctRefreshStubs);
    });
    it("should return user's id", async () => {
      expect(correctResult.id).toBeDefined();
    });
    it('should return username', async () => {
      expect(correctResult.username).toBeDefined();
    });
    it('should return roles', async () => {
      expect(correctResult.roles).toBeDefined();
    });
    it('should return accessToken', async () => {
      expect(correctResult.accessToken).toBeDefined();
    });
    it('should return refreshToken', async () => {
      expect(correctResult.refreshToken).toBeDefined();
    });

    it('should return error with wrong user', async () => {
      await expect(service.refreshToken(wrongRefreshStubs)).rejects.toThrow(
        AUTH_ERROR_MESSAGE_ENUMS.NO_SESSION,
      );
    });
  });
});
