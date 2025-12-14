import { convertFromGrams, convertToKj } from '@curseit/units';

import { Variation } from '@/features/fridge/types/external/variation.types';
import { EnergyUnit } from '@/features/fridge/types/internal/variation.types';

import { VariationModel } from '../types/variation.types';

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
    referenceSizeValue: convertFromGrams(referenceSizeDisplayUnit, referenceSizeInGrams),
    referenceSizeUnit: referenceSizeDisplayUnit,
    energyAmount: convertEnergy(energyAmountInKcal ?? 0, energyDisplayUnit),
    energyUnit: energyDisplayUnit,
    energyAuto,
    portionSizeValue: convertFromGrams(portionSizeDisplayUnit, portionSizeInGrams),
    portionSizeUnit: portionSizeDisplayUnit,
    counter,
  };
};
