import { ConfigType } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { generateMock } from '@anatine/zod-mock';

import { FastifyReply } from 'fastify';

import { DAY, MINUTE } from '@curseit/time';

import { JwtConfig, JwtConfigSchema } from '@/config';
import { JwtReadSchema, UserSchema } from '@/dto';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  ID_TOKEN_COOKIE_NAME,
  ID_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from './constants';
import { SignInSchema, SignUpSchema, TokensSchema } from './dto';
import { CookieSerializeOptions } from 'fastify-cookie';

describe('AuthController', () => {
  let controller: AuthController;
  let MOCK_JWT_CONFIG: jest.Mocked<ConfigType<typeof JwtConfig>>;
  let MOCK_AUTH_SERVICE: jest.Mocked<AuthService>;
  let TARGET_REFRESH_TOKEN_COOKIE_OPTIONS: CookieSerializeOptions;

  const MOCK_USER = generateMock(UserSchema);
  const MOCK_TOKENS = generateMock(TokensSchema);

  const createMockResponse = (): Partial<FastifyReply> => {
    return {
      setCookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: JwtConfig.KEY,
          useValue: {
            ...generateMock(JwtConfigSchema),
            accessTokenTtlInMs: 15 * MINUTE,
            refreshTokenTtlInMs: 30 * DAY,
          },
        },
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
            signOut: jest.fn(),
            signTokens: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    MOCK_JWT_CONFIG = module.get(JwtConfig.KEY);
    MOCK_AUTH_SERVICE = module.get(AuthService);

    TARGET_REFRESH_TOKEN_COOKIE_OPTIONS = {
      ...REFRESH_TOKEN_COOKIE_OPTIONS,
      maxAge: MOCK_JWT_CONFIG.refreshTokenTtlInMs / 1000,
    };
  });

  describe('signUp', () => {
    it('should call the auth service passing the sign up DTO and set cookies', async () => {
      const MOCK_DTO = generateMock(SignUpSchema);
      const MOCK_RESPONSE = createMockResponse() as FastifyReply;

      MOCK_AUTH_SERVICE.signUp.mockResolvedValue(MOCK_USER);
      MOCK_AUTH_SERVICE.signTokens.mockResolvedValue(MOCK_TOKENS);

      const result = await controller.signUp(MOCK_DTO, MOCK_RESPONSE);

      expect(MOCK_AUTH_SERVICE.signUp).toHaveBeenCalledWith(MOCK_DTO);
      expect(MOCK_AUTH_SERVICE.signTokens).toHaveBeenCalledWith(MOCK_USER);
      expect(MOCK_RESPONSE.setCookie).toHaveBeenCalledWith(
        ID_TOKEN_COOKIE_NAME,
        MOCK_TOKENS.idToken,
        ID_TOKEN_COOKIE_OPTIONS,
      );
      expect(MOCK_RESPONSE.setCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_COOKIE_NAME,
        MOCK_TOKENS.refreshToken,
        TARGET_REFRESH_TOKEN_COOKIE_OPTIONS,
      );
      expect(result).toEqual({ access_token: MOCK_TOKENS.accessToken });
    });
  });

  describe('signIn', () => {
    it('should call the auth service passing the sign in DTO and set cookies', async () => {
      const MOCK_DTO = generateMock(SignInSchema);
      const MOCK_RESPONSE = createMockResponse() as FastifyReply;

      MOCK_AUTH_SERVICE.signIn.mockResolvedValue(MOCK_USER);
      MOCK_AUTH_SERVICE.signTokens.mockResolvedValue(MOCK_TOKENS);

      const result = await controller.signIn(MOCK_DTO, MOCK_RESPONSE);

      expect(MOCK_AUTH_SERVICE.signIn).toHaveBeenCalledWith(MOCK_DTO);
      expect(MOCK_AUTH_SERVICE.signTokens).toHaveBeenCalledWith(MOCK_USER);
      expect(MOCK_RESPONSE.setCookie).toHaveBeenCalledWith(
        ID_TOKEN_COOKIE_NAME,
        MOCK_TOKENS.idToken,
        ID_TOKEN_COOKIE_OPTIONS,
      );
      expect(MOCK_RESPONSE.setCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_COOKIE_NAME,
        MOCK_TOKENS.refreshToken,
        TARGET_REFRESH_TOKEN_COOKIE_OPTIONS,
      );
      expect(result).toEqual({ access_token: MOCK_TOKENS.accessToken });
    });
  });

  describe('signOut', () => {
    it('should clear cookies and call the auth service', async () => {
      const MOCK_RESPONSE = createMockResponse() as FastifyReply;
      const MOCK_ACCESS_TOKEN = generateMock(JwtReadSchema);
      const MOCK_REFRESH_TOKEN = generateMock(JwtReadSchema);

      await controller.signOut(MOCK_ACCESS_TOKEN, MOCK_REFRESH_TOKEN, MOCK_RESPONSE);

      expect(MOCK_RESPONSE.clearCookie).toHaveBeenCalledWith(ID_TOKEN_COOKIE_NAME);
      expect(MOCK_RESPONSE.clearCookie).toHaveBeenCalledWith(REFRESH_TOKEN_COOKIE_NAME);
      expect(MOCK_AUTH_SERVICE.signOut).toHaveBeenCalledWith({
        accessToken: MOCK_ACCESS_TOKEN,
        refreshToken: MOCK_REFRESH_TOKEN,
      });
    });
  });

  describe('refresh', () => {
    it('should call the auth service passing the user DTO and set cookies', async () => {
      const response = createMockResponse() as FastifyReply;

      MOCK_AUTH_SERVICE.signTokens.mockResolvedValue(MOCK_TOKENS);

      const result = await controller.refresh(MOCK_USER, response);

      expect(MOCK_AUTH_SERVICE.signTokens).toHaveBeenCalledWith(MOCK_USER);
      expect(response.setCookie).toHaveBeenCalledWith(
        ID_TOKEN_COOKIE_NAME,
        MOCK_TOKENS.idToken,
        ID_TOKEN_COOKIE_OPTIONS,
      );
      expect(response.setCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_COOKIE_NAME,
        MOCK_TOKENS.refreshToken,
        TARGET_REFRESH_TOKEN_COOKIE_OPTIONS,
      );
      expect(result).toEqual({ access_token: MOCK_TOKENS.accessToken });
    });
  });
});
