import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { type FastifyReply } from 'fastify';
import { DAY } from '@curseit/basic-time';
import { CookieSerializeOptions } from 'fastify-cookie';

const REFRESH_COOKIE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
  maxAge: 30 * DAY,
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const user = await this.authService.signUp(dto);

    const { accessToken, refreshToken } = await this.authService.signToken(user);

    response.setCookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

    return { access_token: accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/sign-in')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const user = await this.authService.signIn(dto);

    const { accessToken, refreshToken } = await this.authService.signToken(user);

    response.setCookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

    return { access_token: accessToken };
  }
}
