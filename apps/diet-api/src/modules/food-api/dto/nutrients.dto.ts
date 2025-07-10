import z from 'zod';

export const NutrientInFoodSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  value: z.number().optional(),
  valueInGrams: z.number().optional(),
});
export type NutrientInFood = z.infer<typeof NutrientInFoodSchema>;

export const NutrientsInFoodSchema = z.object({
  nutrientsInFood: z.array(NutrientInFoodSchema),
});
export type NutrientsInFood = z.infer<typeof NutrientsInFoodSchema>;
