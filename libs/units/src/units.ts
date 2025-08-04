export const UNITS = {
  MICROGRAM: 'µg',
  MILLIGRAM: 'mg',
  GRAM: 'g',
  KILOGRAM: 'kg',
  OUNCE: 'oz',
  POUND: 'lb',
} as const;

export type Unit = typeof UNITS[keyof typeof UNITS];

export const UNITS_ARRAY = Object.values(UNITS);

export const ENERGY = {
  KILOJOULE: 'kJ',
  KILOCALORIE: 'kcal',
} as const;

export type Energy = typeof ENERGY[keyof typeof ENERGY];

export const ENERGY_ARRAY = Object.values(ENERGY);
