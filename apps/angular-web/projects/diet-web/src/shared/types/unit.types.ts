import * as z from 'zod/v4-mini';

import { FOOD_UNITS, NUTRIENT_UNITS } from '../constants/units';

export const foodUnit = z.enum(FOOD_UNITS);
export type FoodUnit = z.infer<typeof foodUnit>;

export const nutrientUnit = z.enum(NUTRIENT_UNITS);
export type NutrientUnit = z.infer<typeof nutrientUnit>;
