import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import { FastifyReply } from 'fastify';
import {
  ID_TOKEN_COOKIE_NAME,
  ID_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from '@/constants';
import { JwtReadDto, UserDto } from '@/dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const MOCK_USER: UserDto = { id: '123', login: 'test@example.com' };
  const MOCK_TOKENS = {
    idToken: 'id-token',
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

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
    authService = module.get(AuthService);
  });

  describe('signUp', () => {
    it('should register user and set cookies', async () => {
      const dto: SignUpDto = { login: 'test@example.com', password: 'pass' };
      const response = createMockResponse() as FastifyReply;

      authService.signUp.mockResolvedValue(MOCK_USER);
      authService.signTokens.mockResolvedValue(MOCK_TOKENS);

      const result = await controller.signUp(dto, response);

      expect(authService.signUp).toHaveBeenCalledWith(dto);
      expect(authService.signTokens).toHaveBeenCalledWith(MOCK_USER);
      expect(response.setCookie).toHaveBeenCalledWith(
        ID_TOKEN_COOKIE_NAME,
        MOCK_TOKENS.idToken,
        ID_TOKEN_COOKIE_OPTIONS,
      );
      expect(response.setCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_COOKIE_NAME,
        MOCK_TOKENS.refreshToken,
        REFRESH_TOKEN_COOKIE_OPTIONS,
      );
      expect(result).toEqual({ access_token: MOCK_TOKENS.accessToken });
    });
  });

  describe('signIn', () => {
    it('should authenticate and set cookies', async () => {
      const dto: SignInDto = { login: 'test@example.com', password: 'pass' };
      const response = createMockResponse() as FastifyReply;

      authService.signIn.mockResolvedValue(MOCK_USER);
      authService.signTokens.mockResolvedValue(MOCK_TOKENS);

      const result = await controller.signIn(dto, response);

      expect(authService.signIn).toHaveBeenCalledWith(dto);
      expect(authService.signTokens).toHaveBeenCalledWith(MOCK_USER);
      expect(response.setCookie).toHaveBeenCalledWith(
        ID_TOKEN_COOKIE_NAME,
        MOCK_TOKENS.idToken,
        ID_TOKEN_COOKIE_OPTIONS,
      );
      expect(response.setCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_COOKIE_NAME,
        MOCK_TOKENS.refreshToken,
        REFRESH_TOKEN_COOKIE_OPTIONS,
      );
      expect(result).toEqual({ access_token: MOCK_TOKENS.accessToken });
    });
  });

  describe('signOut', () => {
    it('should clear cookies and call signOut', async () => {
      const response = createMockResponse() as FastifyReply;
      const accessToken: JwtReadDto = {
        sub: 'abc',
        jti: 'def',
        iat: 123,
        exp: 456,
      };
      const refreshToken: JwtReadDto = {
        sub: 'ghi',
        jti: 'def',
        iat: 123,
        exp: 456,
      };

      await controller.signOut(accessToken, refreshToken, response);

      expect(response.clearCookie).toHaveBeenCalledWith(ID_TOKEN_COOKIE_NAME);
      expect(response.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_COOKIE_NAME,
      );
      expect(authService.signOut).toHaveBeenCalledWith(
        accessToken,
        refreshToken,
      );
    });
  });

  describe('refresh', () => {
    it('should refresh tokens and set cookies', async () => {
      const user = MOCK_USER;
      const response = createMockResponse() as FastifyReply;

      authService.signTokens.mockResolvedValue(MOCK_TOKENS);

      const result = await controller.refresh(user, response);

      expect(authService.signTokens).toHaveBeenCalledWith(user);
      expect(response.setCookie).toHaveBeenCalledWith(
        ID_TOKEN_COOKIE_NAME,
        MOCK_TOKENS.idToken,
        ID_TOKEN_COOKIE_OPTIONS,
      );
      expect(response.setCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_COOKIE_NAME,
        MOCK_TOKENS.refreshToken,
        REFRESH_TOKEN_COOKIE_OPTIONS,
      );
      expect(result).toEqual({ access_token: MOCK_TOKENS.accessToken });
    });
  });
});
