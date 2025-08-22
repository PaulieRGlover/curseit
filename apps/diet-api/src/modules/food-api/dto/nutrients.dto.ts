import z from 'zod';

export const NutrientInFoodSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  shortName: z.string().optional(),
  valueInGrams: z.number(),
});
export type NutrientInFood = z.infer<typeof NutrientInFoodSchema>;

export const NutrientsInFoodSchema = z.object({
  nutrientsInFood: z.array(NutrientInFoodSchema),
});
export type NutrientsInFood = z.infer<typeof NutrientsInFoodSchema>;
