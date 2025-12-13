import { convertToGrams, convertToKcal } from '@curseit/units';

import { VariationUpdate } from '@/features/fridge/types/internal/variation.types';

import { VariationModelUpdate } from '../types/variation.types';

export const variationModelUpdateToVariationUpdate = (
  variationModelUpdate: VariationModelUpdate,
  includeEnergy = true,
): VariationUpdate => {
  const { referenceSize, energy, energyAuto, portionSize, counter } = variationModelUpdate;

  const update: VariationUpdate = {};
  if (referenceSize) {
    const [referenceSizeValue, referenceSizeUnit] = referenceSize;

    update.referenceSizeInGrams = convertToGrams(referenceSizeUnit, referenceSizeValue);
    update.referenceSizeDisplayUnit = referenceSizeUnit;
  }

  if (energy && !energyAuto && includeEnergy) {
    const [energyAmountValue, energyUnit] = energy;

    update.energyAmountInKcal =
      energyUnit === 'kJ' ? convertToKcal(energyAmountValue) : energyAmountValue;

    update.energyDisplayUnit = energyUnit;
  }

  if (energyAuto !== undefined) {
    update.energyAuto = energyAuto;
  }

  if (portionSize) {
    const [portionSizeValue, portionSizeUnit] = portionSize;

    update.portionSizeInGrams = convertToGrams(portionSizeUnit, portionSizeValue);
    update.portionSizeDisplayUnit = portionSizeUnit;
  }

  if (counter) {
    update.counter = counter;
  }

  return update;
};
