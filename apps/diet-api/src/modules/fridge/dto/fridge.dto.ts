import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const CreateFoodSchema = z.object({
  name: z.string(),
  counter: z.string().emoji().optional(),
  description: z.string().optional(),
  favorite: z.boolean().optional(),
  picture: z.string().optional(),
});
export class CreateFoodDto extends createZodDto(CreateFoodSchema) {}
