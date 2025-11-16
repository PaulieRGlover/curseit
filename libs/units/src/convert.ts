import { UNITS, type Unit } from './units.js';

export const GRAMS_PER_UNIT: Record<Unit, number> = {
  [UNITS.MICROGRAM]: 0.000001, // one-millionth
  [UNITS.MILLIGRAM]: 0.001, // one-thousandth
  [UNITS.GRAM]: 1,
  [UNITS.KILOGRAM]: 1000,
  [UNITS.OUNCE]: 28.3495,
  [UNITS.POUND]: 453.592,
};

export const round = (value: number, decimals = 6) => Number(value.toFixed(decimals));

export const convertToGrams = (unit: Unit, value: number) => {
  return round(value * GRAMS_PER_UNIT[unit]);
};

export const convertFromGrams = (unit: Unit, value: number) => {
  return round(value / GRAMS_PER_UNIT[unit]);
};

export const convert = (from: Unit, to: Unit, value: number) => {
  const grams = convertToGrams(from, value);
  return convertFromGrams(to, grams);
};

export const convertToKcal = (value: number) => {
  return value * 0.2388;
};

export const convertToKj = (value: number) => {
  return value * 4.184;
};

export const calculateAtwaterKcal = (nutrients: {
  protein?: number;
  carbohydrates?: number;
  fats?: number;
  alcohol?: number;
}) => {
  const { protein = 0, carbohydrates = 0, fats = 0, alcohol = 0 } = nutrients;
  return protein * 4 + carbohydrates * 4 + fats * 9 + alcohol * 7;
};
