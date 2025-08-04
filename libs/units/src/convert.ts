import { UNITS, type Unit } from './units.js';

export const GRAMS_PER_UNIT: Record<Unit, number> = {
  [UNITS.MICROGRAM]: 0.000001, // one-millionth
  [UNITS.MILLIGRAM]: 0.001, // one-thousandth
  [UNITS.GRAM]: 1,
  [UNITS.KILOGRAM]: 1000,
  [UNITS.OUNCE]: 28.3495,
  [UNITS.POUND]: 453.592,
};

export const convertToGrams = (unit: Unit, value: number) => {
  return value * GRAMS_PER_UNIT[unit];
};

export const convertFromGrams = (unit: Unit, value: number) => {
  return value / GRAMS_PER_UNIT[unit];
};

export const convert = (from: Unit, to: Unit, value: number) => {
  const grams = convertToGrams(from, value);
  return convertFromGrams(to, grams);
};
