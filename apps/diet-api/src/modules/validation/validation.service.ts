import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { ZodSchema, z } from 'zod';

import { Nullable } from '@curseit/types';

@Injectable()
export class ValidationService {
  validate<T extends ZodSchema>(schema: T, input: unknown, expection?: HttpException): z.infer<T>;
  validate<T extends ZodSchema>(schema: T, input: unknown, expection: null): Nullable<z.infer<T>>;
  validate<T extends ZodSchema>(
    schema: T,
    input: unknown,
    exception: Nullable<HttpException> = new InternalServerErrorException(),
  ) {
    const result = schema.safeParse(input);
    if (!result.success) {
      if (exception) {
        throw exception;
      } else {
        return null;
      }
    }

    return result.data;
  }
}
