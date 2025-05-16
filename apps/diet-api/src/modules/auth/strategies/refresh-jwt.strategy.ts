import { type FastifyRequest } from 'fastify';
import { Strategy } from 'passport-jwt';
import { JwtConfig } from '@/config';
import { Inject, Injectable } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserDto } from '@/dto';
import { AuthService } from '../auth.service';
import { REFRESH_TOKEN_COOKIE_NAME } from '@/constants';

@Injectable()
export class RefreshJwtStrategy
  extends PassportStrategy<typeof Strategy, UserDto>(Strategy, 'refreshJwt') {
  constructor(
    @Inject(JwtConfig.KEY)
    config: ConfigType<typeof JwtConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: (request: FastifyRequest) => request.cookies?.[REFRESH_TOKEN_COOKIE_NAME],
      secretOrKey: config.refreshJwtSecret,
    });
  }

  validate(payload: unknown) {
    return this.authService.validateToken(payload);
  }
}
