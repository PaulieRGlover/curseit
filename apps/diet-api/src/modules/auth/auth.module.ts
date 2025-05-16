import { v4 } from 'uuid';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessJwtStrategy, RefreshJwtStrategy } from './strategies';
import { HashService } from './hash.service';
import { UUIDV4 } from '@/constants';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    HashService,
    AccessJwtStrategy,
    RefreshJwtStrategy,
    {
      provide: UUIDV4,
      useValue: v4,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
