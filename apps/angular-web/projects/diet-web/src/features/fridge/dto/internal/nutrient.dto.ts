import { UNITS } from '@curseit/units';
import * as z from 'zod/v4-mini';

export const name = z.string().check(
  z.maxLength(255, { message: "Name shouldn't be longer than 255 symbols" }),
  z.minLength(1, { message: 'Name is required' }),
);

export const value = z.number().check(
  z.minimum(0, { message: 'Value should be a positive number' }),
  z.maximum(1000000, { message: "Maybe it's worth considering to upscale the unit?" }),
);

export const unit = z.enum(UNITS);

export const valueUnit = z.tuple([value, unit]);

export const nutrientInput = z.object({ id: z.optional(z.string()), name, value, unit });
export type NutrientInput = z.infer<typeof nutrientInput>;

export const nutrientCreate = z.object({ name, valueInGrams: value, valueDisplayUnit: unit });
export type NutrientCreate = z.infer<typeof nutrientCreate>;
