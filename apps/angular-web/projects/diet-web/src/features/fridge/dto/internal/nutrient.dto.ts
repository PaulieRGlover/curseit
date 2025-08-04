import { UNITS_ARRAY } from '@curseit/units';
import * as z from 'zod/v4-mini';

export const name = z.string().check(
  z.maxLength(255, { message: "Name shouldn't be longer than 255 symbols" }),
  z.minLength(1, { message: 'Name is required' }),
);

export const value = z.number().check(
  z.minimum(0, { message: 'Value should be a positive number' }),
);

export const unit = z.enum(UNITS_ARRAY);

export const nutrient = z.object({ name, value, unit });
export type NutrientDto = z.infer<typeof nutrient>;
