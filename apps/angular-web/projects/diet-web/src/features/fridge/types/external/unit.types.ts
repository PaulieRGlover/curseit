import * as z from 'zod/v4-mini';

import { UNITS } from '@curseit/units';

export const foodUnit = z.enum([
  UNITS.MILLIGRAM,
  UNITS.GRAM,
  UNITS.KILOGRAM,
  UNITS.OUNCE,
  UNITS.POUND,
]);

export const nutrientUnit = z.enum([UNITS.MICROGRAM, UNITS.MILLIGRAM, UNITS.GRAM]);
