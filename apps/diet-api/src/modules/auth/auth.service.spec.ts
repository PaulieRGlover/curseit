import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { generateMock } from '@anatine/zod-mock';
import { faker } from '@faker-js/faker';

import { Prisma } from '@curseit/diet-orm';
import { PRISMA_ERRORS } from '@curseit/prisma-errors';
import { DAY, MINUTE } from '@curseit/time';

import { JwtConfig, JwtConfigSchema } from '@/config';
import { UUIDV4 } from '@/constants';
import { JwtReadSchema, UserSchema } from '@/dto';
import { AUTH_MESSAGES } from '@/messages';

import { PrismaService } from '../prisma/prisma.service';
import { ValidationService } from '../validation/validation.service';

import { AuthService } from './auth.service';
import { HashService } from './hash.service';

describe('AuthService', () => {
  let service: AuthService;
  let MOCK_JWT_CONFIG: jest.Mocked<ConfigType<typeof JwtConfig>>;
  let MOCK_VALIDATION_SERVICE: jest.Mocked<ValidationService>;
  let MOCK_HASH_SERVICE: jest.Mocked<HashService>;
  let MOCK_PRISMA_SERVICE: jest.MockedObjectDeep<PrismaService>;
  let MOCK_JWT_SERVICE: jest.Mocked<JwtService>;

  const MOCK_UUIDV4 = jest.fn();

  const MOCK_LOGIN = faker.string.alpha(12);
  const MOCK_PASSWORD = faker.string.alpha(12);
  const MOCK_ID = faker.string.alpha(12);
  const MOCK_UUID = faker.string.alpha(12);
  const MOCK_HASH = faker.string.alpha(12);
  const MOCK_PRISMA_USER = {
    id: MOCK_ID,
    login: MOCK_LOGIN,
    passwordHash: MOCK_HASH,
  };
  const MOCK_USER = {
    id: MOCK_ID,
    login: MOCK_LOGIN,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtConfig.KEY,
          useValue: {
            ...generateMock(JwtConfigSchema),
            accessTokenTtlInMs: 15 * MINUTE,
            refreshTokenTtlInMs: 30 * DAY,
          },
        },
        {
          provide: UUIDV4,
          useValue: MOCK_UUIDV4,
        },
        {
          provide: ValidationService,
          useValue: {
            validate: jest.fn(),
          },
        },
        {
          provide: HashService,
          useValue: {
            hashPassword: jest.fn(),
            verifyPassword: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
            invalidatedToken: {
              createMany: jest.fn(),
              deleteMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    MOCK_JWT_CONFIG = module.get(JwtConfig.KEY);
    MOCK_VALIDATION_SERVICE = module.get(ValidationService);
    MOCK_HASH_SERVICE = module.get(HashService);
    MOCK_PRISMA_SERVICE = module.get(PrismaService);
    MOCK_JWT_SERVICE = module.get(JwtService);
  });

  describe('signUp', () => {
    it('creates a user replacing their password with hash and return the result', async () => {
      const MOCK_DTO = { login: MOCK_LOGIN, password: MOCK_PASSWORD };

      const TARGET_PRISMA_CREATE_INPUT = {
        data: {
          login: MOCK_LOGIN,
          passwordHash: MOCK_HASH,
        },
      };

      MOCK_HASH_SERVICE.hashPassword.mockResolvedValue(MOCK_HASH);
      MOCK_PRISMA_SERVICE.user.create.mockResolvedValue(MOCK_PRISMA_USER);
      MOCK_VALIDATION_SERVICE.validate.mockReturnValue(MOCK_USER);

      const result = await service.signUp(MOCK_DTO);

      expect(result).toBe(MOCK_USER);

      expect(MOCK_HASH_SERVICE.hashPassword).toHaveBeenCalledWith(MOCK_PASSWORD);
      expect(MOCK_PRISMA_SERVICE.user.create).toHaveBeenCalledWith(TARGET_PRISMA_CREATE_INPUT);
      expect(MOCK_VALIDATION_SERVICE.validate).toHaveBeenCalledWith(UserSchema, MOCK_PRISMA_USER);
    });

    it('throws a conflict exception if PrismaService throws a unique constraint failure', async () => {
      const MOCK_DTO = { login: MOCK_LOGIN, password: MOCK_PASSWORD };

      MOCK_HASH_SERVICE.hashPassword.mockResolvedValue(MOCK_HASH);
      MOCK_PRISMA_SERVICE.user.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('', {
          code: PRISMA_ERRORS.UNIQUE_CONTRAINT_FAILED,
          clientVersion: '',
        }),
      );

      await expect(service.signUp(MOCK_DTO)).rejects.toThrow(
        new ConflictException(AUTH_MESSAGES.CREDENTIALS_TAKEN),
      );
    });

    it('throws an internal server error exception if PrismaService throws', async () => {
      const MOCK_DTO = { login: MOCK_LOGIN, password: MOCK_PASSWORD };

      MOCK_HASH_SERVICE.hashPassword.mockResolvedValue(MOCK_HASH);
      MOCK_PRISMA_SERVICE.user.create.mockRejectedValue('error');

      await expect(service.signUp(MOCK_DTO)).rejects.toThrow(new InternalServerErrorException());
    });
  });

  describe('signIn', () => {
    it('returns the existing user if the password hash is verified', async () => {
      const MOCK_DTO = { login: MOCK_LOGIN, password: MOCK_PASSWORD };

      const TARGET_PRISMA_FIND_UNIQUE_INPUT = { where: { login: MOCK_DTO.login } };

      MOCK_PRISMA_SERVICE.user.findUnique.mockResolvedValue(MOCK_PRISMA_USER);
      MOCK_HASH_SERVICE.verifyPassword.mockResolvedValue(true);
      MOCK_VALIDATION_SERVICE.validate.mockReturnValue(MOCK_USER);

      const result = await service.signIn(MOCK_DTO);

      expect(result).toBe(MOCK_USER);

      expect(MOCK_PRISMA_SERVICE.user.findUnique).toHaveBeenCalledWith(
        TARGET_PRISMA_FIND_UNIQUE_INPUT,
      );
      expect(MOCK_HASH_SERVICE.verifyPassword).toHaveBeenCalledWith(MOCK_HASH, MOCK_PASSWORD);
      expect(MOCK_VALIDATION_SERVICE.validate).toHaveBeenCalledWith(UserSchema, MOCK_PRISMA_USER);
    });

    it('throws unauthorized exception if there is no user found', async () => {
      const MOCK_DTO = { login: MOCK_LOGIN, password: MOCK_PASSWORD };

      MOCK_PRISMA_SERVICE.user.findUnique.mockResolvedValue(null);

      await expect(service.signIn(MOCK_DTO)).rejects.toThrow(
        new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS),
      );
    });

    it('throws unauthorized exception if the password hash is not verified', async () => {
      const MOCK_DTO = { login: MOCK_LOGIN, password: MOCK_PASSWORD };

      MOCK_PRISMA_SERVICE.user.findUnique.mockResolvedValue(MOCK_PRISMA_USER);
      MOCK_HASH_SERVICE.verifyPassword.mockResolvedValue(false);

      await expect(service.signIn(MOCK_DTO)).rejects.toThrow(
        new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS),
      );
    });
  });

  describe('signOut', () => {
    const MOCK_ACCESS_TOKEN = generateMock(JwtReadSchema);
    const MOCK_REFRESH_TOKEN = generateMock(JwtReadSchema);
    const MOCK_DTO = {
      accessToken: MOCK_ACCESS_TOKEN,
      refreshToken: MOCK_REFRESH_TOKEN,
    };

    it('invalidates access and refresh tokens', async () => {
      const fixedNow = new Date();
      jest.useFakeTimers().setSystemTime(fixedNow);

      const TARGET_PRISMA_CREATE_MANY_INPUT = {
        data: [
          { id: MOCK_ACCESS_TOKEN.jti, expiresAt: new Date(MOCK_ACCESS_TOKEN.exp * 1000) },
          { id: MOCK_REFRESH_TOKEN.jti, expiresAt: new Date(MOCK_REFRESH_TOKEN.exp * 1000) },
        ],
      };
      const TARGET_PRISMA_DELETE_MANY_INPUT = {
        where: { expiresAt: { lte: new Date() } },
      };

      MOCK_PRISMA_SERVICE.invalidatedToken.createMany.mockResolvedValue({ count: 1 });
      MOCK_PRISMA_SERVICE.invalidatedToken.deleteMany.mockResolvedValue({ count: 1 });

      await service.signOut(MOCK_DTO);

      expect(MOCK_PRISMA_SERVICE.invalidatedToken.createMany).toHaveBeenCalledWith(
        TARGET_PRISMA_CREATE_MANY_INPUT,
      );
      expect(MOCK_PRISMA_SERVICE.invalidatedToken.deleteMany).toHaveBeenCalledWith(
        TARGET_PRISMA_DELETE_MANY_INPUT,
      );

      jest.useRealTimers();
    });

    it('throws an internal server error exception if PrismaService throws', async () => {
      MOCK_PRISMA_SERVICE.invalidatedToken.createMany.mockRejectedValue('error');

      await expect(service.signOut(MOCK_DTO)).rejects.toThrow(new InternalServerErrorException());

      MOCK_PRISMA_SERVICE.invalidatedToken.createMany.mockResolvedValue({ count: 1 });
      MOCK_PRISMA_SERVICE.invalidatedToken.deleteMany.mockRejectedValue('error');

      await expect(service.signOut(MOCK_DTO)).rejects.toThrow(new InternalServerErrorException());
    });
  });

  describe('signTokens', () => {
    const MOCK_ID_JWT = faker.string.alpha(12);
    const MOCK_ACCESS_JWT = faker.string.alpha(12);
    const MOCK_REFRESH_JWT = faker.string.alpha(12);

    it('signs three tokens and return them', async () => {
      const MOCK_DTO = {
        id: MOCK_ID,
        login: MOCK_LOGIN,
      };

      const TARGET_ID_TOKEN_PAYLOAD = {
        sub: MOCK_ID,
        login: MOCK_LOGIN,
      };
      const TARGET_ACCESS_TOKEN_PAYLOAD = {
        sub: MOCK_ID,
        jti: MOCK_UUID,
      };
      const TARGET_REFRESH_TOKEN_PAYLOAD = {
        sub: MOCK_ID,
        jti: MOCK_UUID,
      };

      MOCK_UUIDV4.mockReturnValue(MOCK_UUID);
      MOCK_JWT_SERVICE.signAsync.mockResolvedValueOnce(MOCK_ID_JWT);
      MOCK_JWT_SERVICE.signAsync.mockResolvedValueOnce(MOCK_ACCESS_JWT);
      MOCK_JWT_SERVICE.signAsync.mockResolvedValueOnce(MOCK_REFRESH_JWT);

      const result = await service.signTokens(MOCK_DTO);

      expect(result).toStrictEqual({
        idToken: MOCK_ID_JWT,
        accessToken: MOCK_ACCESS_JWT,
        refreshToken: MOCK_REFRESH_JWT,
      });

      expect(MOCK_UUIDV4).toHaveBeenCalledTimes(2);
      expect(MOCK_JWT_SERVICE.signAsync).toHaveBeenCalledWith(TARGET_ID_TOKEN_PAYLOAD, {
        secret: MOCK_JWT_CONFIG.idJwtSecret,
      });
      expect(MOCK_JWT_SERVICE.signAsync).toHaveBeenCalledWith(TARGET_ACCESS_TOKEN_PAYLOAD, {
        expiresIn: MOCK_JWT_CONFIG.accessTokenTtlInMs / 1000,
        secret: MOCK_JWT_CONFIG.accessJwtSecret,
      });
      expect(MOCK_JWT_SERVICE.signAsync).toHaveBeenCalledWith(TARGET_REFRESH_TOKEN_PAYLOAD, {
        expiresIn: MOCK_JWT_CONFIG.refreshTokenTtlInMs / 1000,
        secret: MOCK_JWT_CONFIG.refreshJwtSecret,
      });
    });
  });

  describe('validateTokenPayload', () => {
    const MOCK_PAYLOAD = generateMock(JwtReadSchema);

    it('returns the user if they exist and the token is valid', async () => {
      const TARGET_PRISMA_USER_FIND_UNIQUE_INPUT = {
        where: { id: MOCK_PAYLOAD.sub },
      };
      const TARGET_PRISMA_INVALIDATED_TOKEN_FIND_UNIQUE_INPUT = {
        where: { id: MOCK_PAYLOAD.jti },
      };

      MOCK_VALIDATION_SERVICE.validate.mockReturnValueOnce(MOCK_PAYLOAD);
      MOCK_PRISMA_SERVICE.user.findUnique.mockResolvedValue(MOCK_PRISMA_USER);
      MOCK_VALIDATION_SERVICE.validate.mockReturnValueOnce(MOCK_USER);
      MOCK_PRISMA_SERVICE.invalidatedToken.findUnique.mockResolvedValue(null);

      const result = await service.validateTokenPayload(MOCK_PAYLOAD);

      expect(result).toBe(MOCK_USER);

      expect(MOCK_VALIDATION_SERVICE.validate).toHaveBeenCalledWith(
        JwtReadSchema,
        MOCK_PAYLOAD,
        null,
      );
      expect(MOCK_PRISMA_SERVICE.user.findUnique).toHaveBeenCalledWith(
        TARGET_PRISMA_USER_FIND_UNIQUE_INPUT,
      );
      expect(MOCK_VALIDATION_SERVICE.validate).toHaveBeenCalledWith(
        UserSchema,
        MOCK_PRISMA_USER,
        null,
      );
      expect(MOCK_PRISMA_SERVICE.invalidatedToken.findUnique).toHaveBeenCalledWith(
        TARGET_PRISMA_INVALIDATED_TOKEN_FIND_UNIQUE_INPUT,
      );
    });

    it('returns null if the token payload is invalid', async () => {
      MOCK_VALIDATION_SERVICE.validate.mockReturnValueOnce(null);

      const result = await service.validateTokenPayload(MOCK_PAYLOAD);

      expect(result).toBe(null);
    });

    it("returns null if the user doesn't exist", async () => {
      MOCK_VALIDATION_SERVICE.validate.mockReturnValueOnce(MOCK_PAYLOAD);
      MOCK_PRISMA_SERVICE.user.findUnique.mockResolvedValue(null);

      const result = await service.validateTokenPayload(MOCK_PAYLOAD);

      expect(result).toBe(null);
    });

    it('returns null if the user is not valid in prisma service', async () => {
      MOCK_VALIDATION_SERVICE.validate.mockReturnValueOnce(MOCK_PAYLOAD);
      MOCK_PRISMA_SERVICE.user.findUnique.mockResolvedValue(MOCK_PRISMA_USER);
      MOCK_VALIDATION_SERVICE.validate.mockReturnValueOnce(null);

      const result = await service.validateTokenPayload(MOCK_PAYLOAD);

      expect(result).toBe(null);
    });

    it('returns null if the token is invalidated', async () => {
      const MOCK_PRISMA_TOKEN = { id: faker.string.alpha(12), expiresAt: new Date() };

      MOCK_VALIDATION_SERVICE.validate.mockReturnValueOnce(MOCK_PAYLOAD);
      MOCK_PRISMA_SERVICE.user.findUnique.mockResolvedValue(MOCK_PRISMA_USER);
      MOCK_VALIDATION_SERVICE.validate.mockReturnValueOnce(MOCK_USER);
      MOCK_PRISMA_SERVICE.invalidatedToken.findUnique.mockResolvedValue(MOCK_PRISMA_TOKEN);

      const result = await service.validateTokenPayload(MOCK_PAYLOAD);

      expect(result).toBe(null);
    });
  });
});
