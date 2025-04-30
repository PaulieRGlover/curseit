import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from '@/config';
import { Inject, Injectable } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@/dto';
import { AuthService } from '../auth.service';

@Injectable()
export class AccessJwtStrategy
  extends PassportStrategy<typeof Strategy, User>(Strategy, 'accessJwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    config: ConfigType<typeof jwtConfig>,
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
