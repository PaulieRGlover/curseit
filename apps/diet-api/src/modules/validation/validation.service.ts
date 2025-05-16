import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { z, ZodSchema } from 'zod';

@Injectable()
export class ValidationService {
  validate<T extends ZodSchema>(schema: T, input: unknown): z.infer<T> {
    const result = schema.safeParse(input);
    if (!result.success) {
      throw new InternalServerErrorException();
    }

    return result.data;
  }
}
