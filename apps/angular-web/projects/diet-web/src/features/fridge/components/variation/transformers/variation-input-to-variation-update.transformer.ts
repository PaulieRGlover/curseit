import { convertToGrams, convertToKcal } from '@curseit/units';

import { VariationUpdate } from '@/features/fridge/types/external/variation.types';

import { VariationInputUpdate } from '../types/variation-input.types';

export const variationInputUpdateToVariationUpdate = (
  variationInputUpdate: VariationInputUpdate,
): VariationUpdate => {
  const {
    referenceSize,
    energy,
    energyAuto,
    portionSize,
    counter,
  } = variationInputUpdate;

  const update: VariationUpdate = {};
  if (referenceSize) {
    const [referenceSizeValue, referenceSizeUnit] = referenceSize;
    update.referenceSizeInGrams = convertToGrams(referenceSizeUnit, referenceSizeValue);
    update.referenceSizeDisplayUnit = referenceSizeUnit;
  }

  if (energy && !energyAuto) {
    const [energyAmountValue, energyUnit] = energy;
    update.energyAmountInKcal = energyUnit === 'kJ'
      ? convertToKcal(energyAmountValue)
      : energyAmountValue;
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
