import { convertFromGrams, convertToKj } from '@curseit/units';

import { Variation } from '@/features/fridge/types/external/variation.types';
import { EnergyUnit } from '@/features/fridge/types/internal/variation.types';

import { VariationModel } from '../types/variation-model.types';

const convertEnergy = (energyAmountInKcal: number, energyDisplayUnit: EnergyUnit) => {
  return energyDisplayUnit === 'kJ' ? convertToKj(energyAmountInKcal) : energyAmountInKcal;
};

export const variationToVariationModel = (variation: Variation): VariationModel => {
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
