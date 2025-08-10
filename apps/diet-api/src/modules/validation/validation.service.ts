import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { ZodSchema, z } from 'zod';

import { Nullable } from '@curseit/types';

import { AppConfig } from '@/config';

@Injectable()
export class ValidationService {
  constructor(
    @Inject(AppConfig.KEY)
    private readonly appConfig: ConfigType<typeof AppConfig>,
  ) {}

  validate<T extends ZodSchema>(schema: T, input: unknown, exception?: HttpException): z.infer<T>;
  validate<T extends ZodSchema>(schema: T, input: unknown, exception: null): Nullable<z.infer<T>>;
  validate<T extends ZodSchema>(
    schema: T,
    input: unknown,
    exception: Nullable<HttpException> = new InternalServerErrorException(),
  ) {
    const result = schema.safeParse(input);
    if (!result.success) {
      if (this.appConfig.mode === 'local_development') {
        Logger.log(result.error);
      }

      if (exception) {
        throw exception;
      } else {
        return null;
      }
    }

    return result.data;
  }
}
