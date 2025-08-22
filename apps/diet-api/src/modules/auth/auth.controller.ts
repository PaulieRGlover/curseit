import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';

import type { FastifyReply } from 'fastify';
import { CookieSerializeOptions } from 'fastify-cookie';

import type { Nullable } from '@curseit/types';

import { AppConfig, JwtConfig } from '@/config';
import { GetAccessToken, GetRefreshToken, GetUser } from '@/decorators';
import { JwtReadDto, UserDto } from '@/dto';
import { RefreshJwtGuard } from '@/guards';

import { AuthService } from './auth.service';
import {
  ID_TOKEN_COOKIE_NAME,
  ID_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from './constants';
import {
  RefreshResponseDto,
  SignInDto,
  SignInResponseDto,
  SignUpDto,
  SignUpResponseDto,
} from './dto';
import { AuthDelayInterceptor } from './interceptors/auth-delay.interceptor';
import { AUTH_MESSAGES } from './messages/auth.messages';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AppConfig.KEY)
    private readonly appConfig: ConfigType<typeof AppConfig>,
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
    private readonly authService: AuthService,
  ) {}

  private get refreshTokenCookieOptions(): CookieSerializeOptions {
    return {
      ...REFRESH_TOKEN_COOKIE_OPTIONS,
      maxAge: this.jwtConfig.refreshTokenTtlInMs / 1000,
      sameSite: this.appConfig.mode === 'local_development' ? 'none' : 'strict',
    };
  }

  private get idTokenCookieOptions(): CookieSerializeOptions {
    return {
      ...ID_TOKEN_COOKIE_OPTIONS,
      sameSite: this.appConfig.mode === 'local_development' ? 'none' : 'lax',
    };
  }

  @UseInterceptors(AuthDelayInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<SignUpResponseDto> {
    const user = await this.authService.signUp(dto);

    const { idToken, accessToken, refreshToken } = await this.authService.signTokens(user);

    response.setCookie(ID_TOKEN_COOKIE_NAME, idToken, this.idTokenCookieOptions);
    response.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, this.refreshTokenCookieOptions);

    return { access_token: accessToken };
  }

  @UseInterceptors(AuthDelayInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<SignInResponseDto> {
    const user = await this.authService.signIn(dto);

    const { idToken, accessToken, refreshToken } = await this.authService.signTokens(user);

    response.setCookie(ID_TOKEN_COOKIE_NAME, idToken, this.idTokenCookieOptions);
    response.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, this.refreshTokenCookieOptions);

    return { access_token: accessToken };
  }

  @UseInterceptors(AuthDelayInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  async signOut(
    @GetAccessToken(false) accessToken: Nullable<JwtReadDto>,
    @GetRefreshToken(false) refreshToken: Nullable<JwtReadDto>,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<{ message: string }> {
    response.clearCookie(ID_TOKEN_COOKIE_NAME);
    response.clearCookie(REFRESH_TOKEN_COOKIE_NAME);

    this.authService.signOut({ accessToken, refreshToken });

    return { message: AUTH_MESSAGES.SIGN_OUT_SUCCESSFUL };
  }

  @UseGuards(RefreshJwtGuard)
  @Get('refresh')
  async refresh(
    @GetUser() user: UserDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<RefreshResponseDto> {
    const { idToken, accessToken, refreshToken } = await this.authService.signTokens(user);

    response.setCookie(ID_TOKEN_COOKIE_NAME, idToken, this.idTokenCookieOptions);
    response.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, this.refreshTokenCookieOptions);

    return { access_token: accessToken };
  }
}
