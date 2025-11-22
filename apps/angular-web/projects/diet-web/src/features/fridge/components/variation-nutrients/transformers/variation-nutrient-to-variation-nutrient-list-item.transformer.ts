import { VariationNutrient } from '../../../types/external/food.types';
import { VariationNutrientListItem } from '../types/variation-nutrient-list-item.types';

export const variationNutrientToVariationNutrientListItem = (
  variationNutrient: VariationNutrient,
): VariationNutrientListItem => {
  return {
    ...structuredClone(variationNutrient),
    internalId: variationNutrient.id,
    isEmpty: false,
  };
};
