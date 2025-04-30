import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import {
  ConflictException,
  UnauthorizedException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '@/config';
import { type ConfigType } from '@nestjs/config';
import { Prisma } from '@curseit/diet-orm';
import { AUTH_MESSAGES } from '@/messages';
import { PRISMA_ERRORS } from '@curseit/prisma-errors';
import { JwtCreateDto, UserDto, UserSchema, JwtReadSchema, JwtReadDto } from '@/dto';
import { Nullable } from '@curseit/basic-types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly db: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async signUp(dto: SignUpDto): Promise<UserDto> {
    const hash = await argon2.hash(dto.password);

    let user;
    try {
      user = await this.db.user.create({ data: { login: dto.login, passwordHash: hash } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERRORS.UNIQUE_CONTRAINT_FAILED) {
          throw new ConflictException(AUTH_MESSAGES.CREDENTIALS_TAKEN);
        }
      }

      throw new InternalServerErrorException();
    }

    const validatedUser = UserSchema.safeParse(user);
    if (!validatedUser.success) {
      throw new InternalServerErrorException();
    }

    return validatedUser.data;
  }

  async signIn(dto: SignInDto): Promise<UserDto> {
    const user = await this.db.user.findUnique({ where: { login: dto.login } });
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordCorrect = await argon2.verify(user.passwordHash, dto.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS)
    }

    const validatedUser = UserSchema.safeParse(user);
    if (!validatedUser.success) {
      throw new InternalServerErrorException();
    }

    return validatedUser.data;
  }

  async signOut(accessToken: JwtReadDto, refreshToken: JwtReadDto) {
    await this.db.invalidatedToken.createMany({
      data: await Promise.all([accessToken, refreshToken].map(async ({ jti, exp }) => {
        return {
          id: jti,
          expiresAt: new Date(exp * 1000),
        };
      })),
    });

    await this.db.invalidatedToken.deleteMany({ where: { expiresAt: { lte: new Date() } } });
  }

  async signTokens(user: UserDto): Promise<{
    idToken: string,
    accessToken: string,
    refreshToken: string,
  }> {
    const idTokenPayload = { sub: user.id, login: user.login };
    const accessTokenPayload: JwtCreateDto = { sub: user.id, jti: uuidv4() };
    const refreshTokenPayload: JwtCreateDto = { sub: user.id, jti: uuidv4() };
    const { idJwtSecret, accessJwtSecret, refreshJwtSecret } = this.config;

    const [idToken, accessToken, refreshToken] = await Promise.all([
      await this.jwt.signAsync(idTokenPayload, { secret: idJwtSecret }),
      await this.jwt.signAsync(accessTokenPayload, { expiresIn: '5m', secret: accessJwtSecret }),
      await this.jwt.signAsync(refreshTokenPayload, { expiresIn: '1m', secret: refreshJwtSecret }),
    ]);

    return {
      idToken,
      accessToken,
      refreshToken,
    };
  }
  
  async validateToken(payload: unknown): Promise<Nullable<UserDto>> {
    const validatedJwt = JwtReadSchema.safeParse(payload);
    if (!validatedJwt.success) {
      throw new UnauthorizedException();
    }

    const user = await this.db.user.findUnique({ where: { id: validatedJwt.data.sub } });
    if (!user) {
      return null;
    }

    const validatedUser = UserSchema.safeParse(user);
    if (!validatedUser.success) {
      throw new InternalServerErrorException();
    }

    const isTokenInvalidated = Boolean(
      await this.db.invalidatedToken.findUnique({ where: { id: validatedJwt.data.jti } }),
    );
    if (isTokenInvalidated) {
      throw new UnauthorizedException();
    }

    return validatedUser.data;
  }
}
