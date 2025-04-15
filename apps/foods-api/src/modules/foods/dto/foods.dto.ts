import z from 'zod';
import { NutrientInFoodSchema } from './nutrients.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export const FoodSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});
export type Food = z.infer<typeof FoodSchema>;

export const FoodsSchema = z.object({
  foods: z.array(FoodSchema),
});
export type Foods = z.infer<typeof FoodsSchema>;

export const FoodWithNutrientsSchema = FoodSchema.extend({
  nutrients: z.array(NutrientInFoodSchema),
});
export type FoodWithNutrients = z.infer<typeof FoodWithNutrientsSchema>;

export const FoodsWithNutrientsSchema = z.object({
  foodsWithNutrients: z.array(FoodWithNutrientsSchema),
});
export type FoodsWithNutrients = z.infer<typeof FoodsWithNutrientsSchema>;

export class FoodDto extends createZodDto(FoodSchema) {}

export class FoodsDto extends createZodDto(FoodsSchema) {}

export class FoodWithNutrientsDto extends createZodDto(FoodWithNutrientsSchema) {}

export class FoodsWithNutrientsDto extends createZodDto(FoodsWithNutrientsSchema) {}
