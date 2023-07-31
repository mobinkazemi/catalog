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

// ---------- CONSTANTS ----------
const USER_ID = 'mock id';
const USER_ID_WRONG = 'mock id wrong';
const USERNAME = 'mock username';
const USERNAME_WRONG = "I'm false username";
const PASSWORD_WRONG = "I'm false password";
const SESSION_ID = 12345678;
const SESSION_ID_WRONG = 99999999;
const TOKEN = 'mock token';
const PASSWORD = '12345678';
const PASSWORD_HASHED =
  '$2a$08$UEGaMkjWMxhX2gpHEHnG5uu604gLlzNwZcQRZhRw/0G8Hu6BHR9Yu'; // 12345678
// ---------- STUBS ----------
const loginStubs = {
  user: {
    _id: USER_ID,
    username: USERNAME,
    password: PASSWORD_HASHED,
    createdAt: new Date(),
    updatedAt: new Date(),
    roles: [],
  },
};

const correctRefreshStubs = {
  user: {
    payload: {
      userId: USER_ID,
      sessionId: SESSION_ID,
    },
  },
  rawHeaders: ['Athorization', TOKEN],
};

const wrongRefreshStubs = {
  user: {
    payload: {
      userId: USER_ID_WRONG,
    },
  },
  rawHeaders: ['Athorization', TOKEN],
};

const correctRequest = {
  user: {
    payload: {
      userId: USER_ID,
      sessionId: SESSION_ID,
    },
  },
  rawHeaders: ['Athorization', TOKEN],
};
const wrongtRequest = {
  user: {
    payload: {
      userId: USER_ID,
      sessionId: SESSION_ID_WRONG,
    },
  },
  rawHeaders: ['Athorization', TOKEN],
};

const validateUserStubs = {
  validUsername: USERNAME,
  validPassword: PASSWORD,
  invalidUsername: USERNAME_WRONG,
  invalidPassword: PASSWORD_WRONG,
};

// ----------- MOCK SERVICES ------------
const mockUserService = () => ({
  findOne({ id, username }) {
    if (id == USER_ID || username == USERNAME) {
      return loginStubs.user;
    } else {
      return undefined;
    }
  },
});

const mockRedisProxy = () => ({
  setSession: async () => {},
  refSession: async () => {},
  delSession: async (
    userId: string,
    accessToken: string,
    sessionId: number,
  ) => {
    const key = userId + sessionId;

    if (key == USER_ID + SESSION_ID) {
      return;
    } else {
      throw Error();
    }
  },
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

  describe('validate user', () => {
    it("should return user's info", async () => {
      const result = await service.validateUser(
        validateUserStubs.validUsername,
        validateUserStubs.validPassword,
      );

      expect(result.username).toBeDefined();
    });

    it('should return undefined with wrong username', async () => {
      const result = await service.validateUser(
        validateUserStubs.invalidUsername,
        validateUserStubs.validPassword,
      );

      expect(result).toBeUndefined();
    });

    it('should return undefined with wrong password', async () => {
      const result = await service.validateUser(
        validateUserStubs.validUsername,
        validateUserStubs.invalidPassword,
      );

      expect(result).toBeUndefined();
    });

    // it('should return error with wrong user', async () => {
    //   await expect(service.refreshToken(wrongRefreshStubs)).rejects.toThrow(
    //     AUTH_ERROR_MESSAGE_ENUMS.NO_SESSION,
    //   );
    // });
  });

  describe('logout', () => {
    it('should not return error with correct data', async () => {
      const result = await service.logout(correctRequest);

      expect(result).toBeUndefined();
    });

    it('should return Bad-Request error with wrong data', async () => {
      await expect(service.logout(wrongtRequest)).rejects.toThrow(
        AUTH_ERROR_MESSAGE_ENUMS.NO_SESSION,
      );
    });
  });
});
