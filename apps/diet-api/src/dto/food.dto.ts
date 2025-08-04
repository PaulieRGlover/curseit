import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const FoodPortionSchema = z.object({
  id: z.string(),
  variationId: z.string(),
  timeAdded: z.date(),
  timeExpiring: z.date(),
  sizeInGrams: z.number(),
  sizeDisplayUnit: z.string(),
});

export const FoodSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  counter: z.string(),
  perishable: z.boolean(),
  favorite: z.boolean(),
  picture: z.string().nullable(),
});
export class FoodDto extends createZodDto(FoodSchema) {}

export const FoodWithPortionsSchema = FoodSchema.extend({
  portions: z.array(FoodPortionSchema),
});
export class FoodWithPortionsDto extends createZodDto(FoodWithPortionsSchema) {}

export const FoodsSchema = z.array(FoodSchema);
export class FoodsDto extends createZodDto(FoodsSchema) {}

export const FoodsWithPortionsSchema = z.array(FoodWithPortionsSchema);
export class FoodsWithPortionsDto extends createZodDto(FoodsWithPortionsSchema) {}
