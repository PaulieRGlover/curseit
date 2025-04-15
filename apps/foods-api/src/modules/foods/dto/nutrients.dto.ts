import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const NutrientSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  norm: z.number().optional(),
});
export type Nutrient = z.infer<typeof NutrientSchema>;

export const NutrientsSchema = z.object({
  nutrients: z.array(NutrientSchema),
});
export type Nutrients = z.infer<typeof NutrientsSchema>;

export const NutrientInFoodSchema = NutrientSchema.extend({
  id: z.string().uuid().optional(),
  value: z.number().optional(),
});
export type NutrientInFood = z.infer<typeof NutrientInFoodSchema>;

export const NutrientsInFoodSchema = z.object({
  nutrientsInFood: z.array(NutrientInFoodSchema),
});
export type NutrientsInFood = z.infer<typeof NutrientsInFoodSchema>;

export class NutrientDto extends createZodDto(NutrientSchema) {}

export class NutrientsDto extends createZodDto(NutrientsSchema) {}
