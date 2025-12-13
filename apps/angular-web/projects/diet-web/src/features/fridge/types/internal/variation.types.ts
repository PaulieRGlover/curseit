import * as z from 'zod/v4-mini';

import { ENERGY } from '@curseit/units';

import { NUTRIENT_UNITS } from '../../constants/units';
import { foodUnit } from '../external/unit.types';
import {
  variation,
  variationNutrient,
} from '../external/variation.types';

export const variationNutrientName = z
  .string()
  .check(
    z.maxLength(255, { message: "Name shouldn't be longer than 255 symbols" }),
    z.minLength(1, { message: 'Name is required' }),
  );

export const variationNutrientValue = z
  .number()
  .check(
    z.minimum(0, { message: 'Value should be a positive number' }),
    z.maximum(1000000, { message: "Maybe it's worth considering to upscale the unit?" }),
  );

export const portionSizeValue = z.number().check(z.minimum(0), z.maximum(1000));
export type PortionSizeValue = z.infer<typeof portionSizeValue>;

export const portionSizeUnit = foodUnit;
export type PortionSizeUnit = z.infer<typeof portionSizeUnit>;

export const portionSize = z.tuple([portionSizeValue, portionSizeUnit]);
export type PortionSize = z.infer<typeof portionSize>;

export const counter = z.emoji();
export type Counter = z.infer<typeof counter>;

export const unit = z.enum(NUTRIENT_UNITS);
export type Unit = z.infer<typeof unit>;

export const referenceSizeValue = z.number().check(z.minimum(0), z.maximum(1000));
export type ReferenceSizeValue = z.infer<typeof referenceSizeValue>;

export const referenceSizeUnit = foodUnit;
export type ReferenceSizeUnit = z.infer<typeof referenceSizeUnit>;

export const referenceSize = z.tuple([referenceSizeValue, referenceSizeUnit]);
export type ReferenceSize = z.infer<typeof referenceSize>;

export const energyAmount = z.number().check(z.minimum(0));
export type EnergyAmount = z.infer<typeof energyAmount>;

export const energyUnit = z.enum(ENERGY);
export type EnergyUnit = z.infer<typeof energyUnit>;

export const energy = z.tuple([energyAmount, energyUnit]);
export type Energy = z.infer<typeof energy>;

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
