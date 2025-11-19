import { convertFromGrams } from '@curseit/units';

import { VariationNutrientListItem } from '../../variation-nutrients/types/variation-nutrient-list-item.types';
import { VariationNutrientInput } from '../types/variation-nutrient-input.types';

export const variationNutrientListItemToVariationNutrientInput = (
  variationNutrientListItem: VariationNutrientListItem,
): VariationNutrientInput => {
  return {
    name: variationNutrientListItem.name,
    amount: [
      convertFromGrams(
        variationNutrientListItem.valueDisplayUnit,
        variationNutrientListItem.valueInGrams,
      ),
      variationNutrientListItem.valueDisplayUnit,
    ],
    nutrientId: variationNutrientListItem.nutrientId,
  };
};
