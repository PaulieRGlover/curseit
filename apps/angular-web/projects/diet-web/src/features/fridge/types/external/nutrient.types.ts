import * as z from 'zod/v4-mini';

export const nutrient = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.nullable(z.string()),
  description: z.nullable(z.string()),
});
export type Nutrient = z.infer<typeof nutrient>;

export const nutrientAbridged = z.omit(nutrient, {
  shortName: true,
  description: true,
});
export type NutrientAbridged = z.infer<typeof nutrientAbridged>;

export const nutrients = z.array(nutrient);
export type Nutrients = z.infer<typeof nutrients>;

export const nutrientsAbridged = z.array(nutrientAbridged);
export type NutrientsAbridged = z.infer<typeof nutrientsAbridged>;
