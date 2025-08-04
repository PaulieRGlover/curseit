import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Prisma } from '@curseit/diet-orm';
import { PRISMA_ERRORS } from '@curseit/prisma-errors';
import { Nullable } from '@curseit/types';
import { isNotNull } from '@curseit/utils';

import { JwtConfig } from '@/config';
import { UUIDV4 } from '@/constants';
import { JwtCreateDto, JwtReadSchema, UserDto, UserSchema } from '@/dto';

import { PrismaService } from '../prisma/prisma.service';
import { ValidationService } from '../validation/validation.service';

import { SignInDto, SignOutDto, SignUpDto, TokensDto } from './dto';
import { HashService } from './hash.service';
import { AUTH_MESSAGES } from './messages/auth.messages';

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
    @Inject(UUIDV4)
    private readonly uuidv4: typeof import('uuid').v4,
    private readonly validationService: ValidationService,
    private readonly hashService: HashService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto): Promise<UserDto> {
    const hash = await this.hashService.hashPassword(dto.password);

    let user;
    try {
      user = await this.prismaService.user.create({
        data: { login: dto.login, passwordHash: hash },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERRORS.UNIQUE_CONSTRAINT_FAILED) {
          throw new ConflictException(AUTH_MESSAGES.CREDENTIALS_TAKEN);
        }
      }

      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof UserSchema>(UserSchema, user);
  }

  async signIn(dto: SignInDto): Promise<UserDto> {
    const user = await this.prismaService.user.findUnique({ where: { login: dto.login } });
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordCorrect = await this.hashService.verifyPassword(
      user.passwordHash,
      dto.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    return this.validationService.validate<typeof UserSchema>(UserSchema, user);
  }

  async signOut(dto: SignOutDto) {
    try {
      const tokens = [dto.accessToken, dto.refreshToken].filter(isNotNull);
      if (!tokens.length) {
        return;
      }

      const alreadyInvalidatedTokens = await this.prismaService.invalidatedToken.findMany({
        where: { id: { in: tokens.map(({ jti }) => jti) } },
      });
      const tokensToInvalidate = tokens.filter(({ jti }) => {
        return alreadyInvalidatedTokens.every(({ id }) => jti !== id);
      });

      if (!tokensToInvalidate.length) {
        return;
      }

      await this.prismaService.invalidatedToken.createMany({
        data: tokensToInvalidate.map(({ jti, exp }) => ({
          id: jti,
          expiresAt: new Date(exp * 1000),
        })),
      });

      await this.prismaService.invalidatedToken.deleteMany({
        where: { expiresAt: { lte: new Date() } },
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async signTokens(user: UserDto): Promise<TokensDto> {
    const idTokenPayload = {
      sub: user.id,
      login: user.login,
      given_name: user.firstName,
      family_name: user.lastName,
    };
    const accessTokenPayload: JwtCreateDto = { sub: user.id, jti: this.uuidv4() };
    const refreshTokenPayload: JwtCreateDto = { sub: user.id, jti: this.uuidv4() };
    const { idJwtSecret, accessJwtSecret, refreshJwtSecret } = this.jwtConfig;

    const [idToken, accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(idTokenPayload, {
        expiresIn: this.jwtConfig.refreshTokenTtlInMs / 1000,
        secret: idJwtSecret,
      }),
      await this.jwtService.signAsync(accessTokenPayload, {
        expiresIn: this.jwtConfig.accessTokenTtlInMs / 1000,
        secret: accessJwtSecret,
      }),
      await this.jwtService.signAsync(refreshTokenPayload, {
        expiresIn: this.jwtConfig.refreshTokenTtlInMs / 1000,
        secret: refreshJwtSecret,
      }),
    ]);

    return {
      idToken,
      accessToken,
      refreshToken,
    };
  }

  async validateTokenPayload(payload: unknown): Promise<Nullable<UserDto>> {
    const validatedJwt = this.validationService.validate<typeof JwtReadSchema>(
      JwtReadSchema,
      payload,
      null,
    );
    if (!validatedJwt) {
      return null;
    }

    const user = await this.prismaService.user.findUnique({ where: { id: validatedJwt.sub } });
    if (!user) {
      return null;
    }

    const validatedUser = this.validationService.validate<typeof UserSchema>(
      UserSchema,
      user,
      null,
    );
    if (!validatedUser) {
      return null;
    }

    const isTokenInvalidated = Boolean(
      await this.prismaService.invalidatedToken.findUnique({
        where: { id: validatedJwt.jti },
      }),
    );
    if (isTokenInvalidated) {
      return null;
    }

    return validatedUser;
  }
}
