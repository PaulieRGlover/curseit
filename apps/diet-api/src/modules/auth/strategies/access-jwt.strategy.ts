import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfig } from '@/config';
import { Inject, Injectable } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserDto } from '@/dto';
import { AuthService } from '../auth.service';

@Injectable()
export class AccessJwtStrategy
  extends PassportStrategy<typeof Strategy, UserDto>(Strategy, 'accessJwt') {
  constructor(
    @Inject(JwtConfig.KEY)
    config: ConfigType<typeof JwtConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.accessJwtSecret,
    });
  }

  validate(payload: unknown) {
    return this.authService.validateToken(payload);
  }
}
