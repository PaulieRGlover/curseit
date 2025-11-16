import * as z from 'zod/v4-mini';

import { ENERGY } from '@curseit/units';

import { foodUnit } from '@/features/fridge/types/external/food.types';

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

export const portionSizeValue = z.number().check(z.minimum(0), z.maximum(1000));
export type PortionSizeValue = z.infer<typeof portionSizeValue>;

export const portionSizeUnit = foodUnit;
export type PortionSizeUnit = z.infer<typeof portionSizeUnit>;

export const portionSize = z.tuple([portionSizeValue, portionSizeUnit]);
export type PortionSize = z.infer<typeof portionSize>;

export const counter = z.emoji();
export type Counter = z.infer<typeof counter>;

export const variationInput = z.object({
  referenceSize,
  energy,
  energyAuto,
  portionSize,
  counter,
});
export type VariationInput = z.infer<typeof variationInput>;

export const variationInputUpdate = z.partial(variationInput);
export type VariationInputUpdate = z.infer<typeof variationInputUpdate>;
