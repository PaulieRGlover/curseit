import * as argon2 from 'argon2';
import { HashConfig } from '@/config';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';

@Injectable()
export class HashService {
  private secret: Buffer; // argon2 requires Buffer

  constructor(
    @Inject(HashConfig.KEY)
    hashConfig: ConfigType<typeof HashConfig>,
  ) {
    this.secret = Buffer.from(hashConfig.hashSecret, 'utf-8');
  }

  hashPassword(password: string) {
    try {
      return argon2.hash(password, { secret: this.secret });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  verifyPassword(hash: string, password: string) {
    try {
      return argon2.verify(hash, password, { secret: this.secret });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
