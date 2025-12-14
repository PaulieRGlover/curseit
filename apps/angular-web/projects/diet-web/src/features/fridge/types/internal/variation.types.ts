import * as z from 'zod/v4-mini';

import { ENERGY } from '@curseit/units';

import { NUTRIENT_UNITS } from '../../constants/units';
import { foodUnit } from '../external/unit.types';
import {
  variation,
  variationNutrient,
} from '../external/variation.types';

export const variationNutrientValue = z
  .number()
  .check(
    z.minimum(0, { message: 'Value should be a positive number' }),
    z.maximum(1000000, { message: "Maybe it's worth considering to upscale the unit?" }),
  );
export type VariationNutrientValue = z.infer<typeof variationNutrientValue>;

export const portionSizeValue = z.number().check(z.minimum(0), z.maximum(1000));
export type PortionSizeValue = z.infer<typeof portionSizeValue>;

export const portionSizeUnit = foodUnit;
export type PortionSizeUnit = z.infer<typeof portionSizeUnit>;

export const counter = z.emoji();
export type Counter = z.infer<typeof counter>;

export const nutrientUnit = z.enum(NUTRIENT_UNITS);
export type NutrientUnit = z.infer<typeof nutrientUnit>;

export const referenceSizeValue = z.number().check(z.minimum(0), z.maximum(1000));
export type ReferenceSizeValue = z.infer<typeof referenceSizeValue>;

export const referenceSizeUnit = foodUnit;
export type ReferenceSizeUnit = z.infer<typeof referenceSizeUnit>;

export const energyAmount = z.number().check(z.minimum(0));
export type EnergyAmount = z.infer<typeof energyAmount>;

export const energyUnit = z.enum(ENERGY);
export type EnergyUnit = z.infer<typeof energyUnit>;

export const energyAuto = z.boolean();
export type EnergyAuto = z.infer<typeof energyAuto>;

export const variationNutrientCreate = z.partial(variationNutrient);
export type VariationNutrientCreate = z.infer<typeof variationNutrientCreate>;

export const variationNutrientUpdate = z.omit(variationNutrientCreate, { id: true });
export type VariationNutrientUpdate = z.infer<typeof variationNutrientUpdate>;

export const variationCreate = z.pick(variation, { name: true });
export type VariationCreate = z.infer<typeof variationCreate>;

export const variationUpdate = z.partial(z.omit(variation, { id: true }));
export type VariationUpdate = z.infer<typeof variationUpdate>;
