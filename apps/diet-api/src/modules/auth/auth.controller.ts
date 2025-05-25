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
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';

import type { FastifyReply } from 'fastify';
import { CookieSerializeOptions } from 'fastify-cookie';

import { JwtConfig } from '@/config';
import { GetAccessToken, GetRefreshToken, GetUser } from '@/decorators';
import { JwtReadDto, UserDto } from '@/dto';
import { AccessJwtGuard, RefreshJwtGuard } from '@/guards';
import { AUTH_MESSAGES } from '@/messages';

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

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
    private readonly authService: AuthService,
  ) {}

  private get refreshTokenCookieOptions(): CookieSerializeOptions {
    return {
      ...REFRESH_TOKEN_COOKIE_OPTIONS,
      maxAge: this.jwtConfig.refreshTokenTtlInMs / 1000,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<SignUpResponseDto> {
    const user = await this.authService.signUp(dto);

    const { idToken, accessToken, refreshToken } = await this.authService.signTokens(user);

    response.setCookie(ID_TOKEN_COOKIE_NAME, idToken, ID_TOKEN_COOKIE_OPTIONS);
    response.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, this.refreshTokenCookieOptions);

    return { access_token: accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<SignInResponseDto> {
    const user = await this.authService.signIn(dto);

    const { idToken, accessToken, refreshToken } = await this.authService.signTokens(user);

    response.setCookie(ID_TOKEN_COOKIE_NAME, idToken, ID_TOKEN_COOKIE_OPTIONS);
    response.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, this.refreshTokenCookieOptions);

    return { access_token: accessToken };
  }

  @UseGuards(RefreshJwtGuard, AccessJwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  async signOut(
    @GetAccessToken() accessToken: JwtReadDto,
    @GetRefreshToken() refreshToken: JwtReadDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<string> {
    response.clearCookie(ID_TOKEN_COOKIE_NAME);
    response.clearCookie(REFRESH_TOKEN_COOKIE_NAME);

    this.authService.signOut({ accessToken, refreshToken });

    return AUTH_MESSAGES.SIGN_OUT_SUCCESSFUL;
  }

  @UseGuards(RefreshJwtGuard)
  @Get('refresh')
  async refresh(
    @GetUser() user: UserDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<RefreshResponseDto> {
    const { idToken, accessToken, refreshToken } = await this.authService.signTokens(user);

    response.setCookie(ID_TOKEN_COOKIE_NAME, idToken, ID_TOKEN_COOKIE_OPTIONS);
    response.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, this.refreshTokenCookieOptions);

    return { access_token: accessToken };
  }
}
