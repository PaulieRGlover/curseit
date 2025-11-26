import * as z from 'zod/v4-mini';

import { FOOD_UNITS, NUTRIENT_UNITS } from '../../constants/units';

export const foodUnit = z.enum(FOOD_UNITS);

export const nutrientUnit = z.enum(NUTRIENT_UNITS);
