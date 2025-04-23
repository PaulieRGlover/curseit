import { Injectable } from '@nestjs/common';
import { SignInDto, User, UserSchema } from './dto/auth.dto';
import { Nullable } from '@curseit/basic-types';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly db: PrismaService) {}

  async signIn(dto: SignInDto): Promise<Nullable<User>> {
    const user = await this.db.user.findUnique({ where: { login: dto.login } });
    if (!user) {
      return null;
    }

    const isPasswordCorrect = await argon2.verify(user.passwordHash, dto.password);
    if (!isPasswordCorrect) {
      return null;
    }

    return UserSchema.safeParse(user).data ?? null;
  }
}
