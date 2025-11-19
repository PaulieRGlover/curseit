import { convertFromGrams, convertToKj } from '@curseit/units';

import { Variation } from '@/features/fridge/types/external/food.types';

import { EnergyUnit, VariationInput } from '../types/variation-input.types';

const convertEnergy = (energyAmountInKcal: number, energyDisplayUnit: EnergyUnit) => {
  return energyDisplayUnit === 'kJ' ? convertToKj(energyAmountInKcal) : energyAmountInKcal;
};

export const variationToVariationInput = (variation: Variation): VariationInput => {
  const {
    referenceSizeDisplayUnit,
    referenceSizeInGrams,
    energyDisplayUnit,
    energyAmountInKcal,
    energyAuto,
    portionSizeDisplayUnit,
    portionSizeInGrams,
    counter,
  } = variation;

  return {
    referenceSize: [
      convertFromGrams(referenceSizeDisplayUnit, referenceSizeInGrams),
      referenceSizeDisplayUnit,
    ],
    energy: [convertEnergy(energyAmountInKcal ?? 0, energyDisplayUnit), energyDisplayUnit],
    energyAuto,
    portionSize: [
      convertFromGrams(portionSizeDisplayUnit, portionSizeInGrams),
      portionSizeDisplayUnit,
    ],
    counter,
  };
};
