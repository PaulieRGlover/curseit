import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RefreshResponseDto,
  SignInDto,
  SignInResponseDto,
  SignUpDto,
  SignUpResponseDto,
} from './dto/auth.dto';
import type { FastifyReply } from 'fastify';
import {
  ID_TOKEN_COOKIE_NAME,
  ID_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from '@/constants';
import { AccessJwtGuard, RefreshJwtGuard } from '@/guards';
import { GetAccessToken, GetRefreshToken, GetUser } from '@/decorators';
import { JwtReadDto, UserDto } from '@/dto';
import { AUTH_MESSAGES } from '@/messages';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<SignUpResponseDto> {
    const user = await this.authService.signUp(dto);

    const { idToken, accessToken, refreshToken } = await this.authService.signTokens(user);

    response.setCookie(ID_TOKEN_COOKIE_NAME, idToken, ID_TOKEN_COOKIE_OPTIONS);
    response.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

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
    response.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

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

    this.authService.signOut(accessToken, refreshToken);

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
    response.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    return { access_token: accessToken };
  }
}
