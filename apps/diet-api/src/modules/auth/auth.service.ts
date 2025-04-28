import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignInDto, SignUpDto, User, UserSchema } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '@/config';
import { type ConfigType } from '@nestjs/config';
import { Prisma } from '@curseit/diet-orm';
import { AUTH_MESSAGES } from '@/messages';
import { PRISMA_ERRORS } from '@curseit/prisma-errors';

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly db: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async signUp(dto: SignUpDto): Promise<User> {
    const hash = await argon2.hash(dto.password);

    let user;
    try {
      user = await this.db.user.create({ data: { login: dto.login, passwordHash: hash } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERRORS.UNIQUE_CONTRAINT_FAILED) {
          throw new ForbiddenException(AUTH_MESSAGES.CREDENTIALS_TAKEN);
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

  async signIn(dto: SignInDto): Promise<User> {
    const user = await this.db.user.findUnique({ where: { login: dto.login } });
    if (!user) {
      throw new ForbiddenException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordCorrect = await argon2.verify(user.passwordHash, dto.password);
    if (!isPasswordCorrect) {
      throw new ForbiddenException(AUTH_MESSAGES.INVALID_CREDENTIALS)
    }

    const validatedUser = UserSchema.safeParse(user);
    if (!validatedUser.success) {
      throw new InternalServerErrorException();
    }

    return validatedUser.data;
  }

  async signToken(user: User): Promise<{ accessToken: string, refreshToken: string }> {
    const payload = { sub: user.id, login: user.login };
    const secret = this.config.jwtSecret;

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwt.signAsync(payload, { expiresIn: '1m', secret }),
      await this.jwt.signAsync({ sub: user.id }, { expiresIn: '30d', secret }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
