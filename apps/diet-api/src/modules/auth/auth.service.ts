import {
  ConflictException,
  UnauthorizedException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignInDto, SignUpDto, TokensDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from '@/config';
import { type ConfigType } from '@nestjs/config';
import { Prisma } from '@curseit/diet-orm';
import { AUTH_MESSAGES } from '@/messages';
import { PRISMA_ERRORS } from '@curseit/prisma-errors';
import { JwtCreateDto, UserDto, UserSchema, JwtReadSchema, JwtReadDto } from '@/dto';
import { Nullable } from '@curseit/basic-types';
import { HashService } from './hash.service';
import { UUIDV4 } from '@/constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
    @Inject(UUIDV4)
    private readonly uuidv4: typeof import('uuid').v4,
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

    const validatedUser = UserSchema.safeParse(user);
    if (!validatedUser.success) {
      throw new InternalServerErrorException();
    }

    return validatedUser.data;
  }

  async signOut(accessToken: JwtReadDto, refreshToken: JwtReadDto) {
    await this.prismaService.invalidatedToken.createMany({
      data: await Promise.all(
        [accessToken, refreshToken].map(async ({ jti, exp }) => {
          return {
            id: jti,
            expiresAt: new Date(exp * 1000),
          };
        }),
      ),
    });

    await this.prismaService.invalidatedToken.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });
  }

  async signTokens(user: UserDto): Promise<TokensDto> {
    const idTokenPayload = { sub: user.id, login: user.login };
    const accessTokenPayload: JwtCreateDto = { sub: user.id, jti: this.uuidv4() };
    const refreshTokenPayload: JwtCreateDto = { sub: user.id, jti: this.uuidv4() };
    const { idJwtSecret, accessJwtSecret, refreshJwtSecret } = this.jwtConfig;

    const [idToken, accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(idTokenPayload, { secret: idJwtSecret }),
      await this.jwtService.signAsync(accessTokenPayload, {
        expiresIn: this.jwtConfig.accessTokenTtl,
        secret: accessJwtSecret,
      }),
      await this.jwtService.signAsync(refreshTokenPayload, {
        expiresIn: this.jwtConfig.refreshTokenTtl,
        secret: refreshJwtSecret,
      }),
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

    const user = await this.prismaService.user.findUnique({ where: { id: validatedJwt.data.sub } });
    if (!user) {
      return null;
    }

    const validatedUser = UserSchema.safeParse(user);
    if (!validatedUser.success) {
      throw new InternalServerErrorException();
    }

    const isTokenInvalidated = Boolean(
      await this.prismaService.invalidatedToken.findUnique({
        where: { id: validatedJwt.data.jti },
      }),
    );
    if (isTokenInvalidated) {
      throw new UnauthorizedException();
    }

    return validatedUser.data;
  }
}
