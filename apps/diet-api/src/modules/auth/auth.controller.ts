import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, UserDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AUTH_MESSAGES } from '@/messages';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/sign-in')
  async signIn(@Body() dto: SignInDto) {
    const user = await this.authService.signIn(dto);
    if (!user) {
      throw new ForbiddenException(AUTH_MESSAGES.INVALID_CREDENTIALS)
    }

    return this.signToken
  }

  private async signToken(user: UserDto): Promise<{ access_token: string }> {
    const payload = { sub: user.id, login: user.login };
  }
}
