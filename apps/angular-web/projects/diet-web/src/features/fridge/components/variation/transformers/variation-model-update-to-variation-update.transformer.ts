import { convertToGrams, convertToKcal } from '@curseit/units';

import { VariationUpdate } from '@/features/fridge/types/internal/variation.types';

import { VariationModelUpdate } from '../types/variation.types';

export const variationModelUpdateToVariationUpdate = (
  variationModelUpdate: VariationModelUpdate,
  includeEnergy = true,
): VariationUpdate => {
  const {
    referenceSizeValue,
    referenceSizeUnit,
    energyAmount,
    energyUnit,
    energyAuto,
    portionSizeValue,
    portionSizeUnit,
    counter,
  } = variationModelUpdate;

  const update: VariationUpdate = {};
  if (referenceSizeValue && referenceSizeUnit) {
    update.referenceSizeInGrams = convertToGrams(referenceSizeUnit, referenceSizeValue);
  }

  if (referenceSizeUnit) {
    update.referenceSizeDisplayUnit = referenceSizeUnit;
  }

  if (energyAmount && energyUnit && !energyAuto && includeEnergy) {
    update.energyAmountInKcal = energyUnit === 'kJ' ? convertToKcal(energyAmount) : energyAmount;
  }

  if (energyUnit) {
    update.energyDisplayUnit = energyUnit;
  }

  if (energyAuto !== undefined) {
    update.energyAuto = energyAuto;
  }

  if (portionSizeValue && portionSizeUnit) {
    update.portionSizeInGrams = convertToGrams(portionSizeUnit, portionSizeValue);
  }
  
  if (portionSizeUnit) {
    update.portionSizeDisplayUnit = portionSizeUnit;
  }

  if (counter) {
    update.counter = counter;
  }

  return update;
};
