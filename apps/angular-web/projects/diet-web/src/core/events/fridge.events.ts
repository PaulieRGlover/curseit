import { FoodUnit } from '@/shared/types/unit.types';

export type CookPortions = Array<{
  id?: string;
  foodPortionId: string;
  sizeInGrams?: number;
  sizeDisplayUnit?: FoodUnit,
  maximumSizeInGrams?: number;
}>;

export type DiscardPortionsFromCooking = Array<string>;
