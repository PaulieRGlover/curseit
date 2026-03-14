import { DAY, HOUR, WEEK } from '@curseit/time';

import { FoodUnit, NutrientUnit } from '../../dist/index.js';

export type PortionSeed = {
  dateAdded?: string;
  dateExpiring?: string;
  sizeInGrams: number;
  sizeDisplayUnit?: FoodUnit;
  remainingInGrams?: number;
  remainingDisplayUnit?: FoodUnit;
};

export type NutrientSeed = {
  valueInGrams: number;
  valueDisplayUnit?: NutrientUnit;
  nutrientId: string;
};

export type VariationSeed = {
  name: string;
  counter?: string;
  nutrients?: Array<NutrientSeed>;
  portions?: Array<PortionSeed>;
  portionSizeInGrams?: number;
  portionSizeDisplayUnit?: FoodUnit;
};

export type FoodSeed = {
  name: string;
  description?: string;
  variations: Array<VariationSeed>;
};

export const getFoods = (nutrients: {
  proteinId: string;
  fatsId: string;
  carbsId: string;
  nitrogenId: string;
  calciumId: string;
  ironId: string;
  magnesiumId: string;
  potassiumId: string;
}): Array<FoodSeed> => {
  const { proteinId, fatsId, carbsId, nitrogenId, calciumId, ironId, magnesiumId, potassiumId } =
    nutrients;
  return [
    {
      name: 'Molk Bolk',
      description: 'This is Molk Bolk',
      variations: [
        {
          name: 'Default',
          counter: '🥛',
          nutrients: [
            {
              valueInGrams: 12,
              valueDisplayUnit: NutrientUnit.g,
              nutrientId: proteinId,
            },
            {
              valueInGrams: 12,
              valueDisplayUnit: NutrientUnit.g,
              nutrientId: fatsId,
            },
            {
              valueInGrams: 12,
              valueDisplayUnit: NutrientUnit.g,
              nutrientId: carbsId,
            },
          ],
          portions: [
            {
              dateExpiring: new Date(new Date().getTime() + WEEK).toISOString(),
              sizeInGrams: 150,
              sizeDisplayUnit: FoodUnit.g,
              remainingInGrams: 100,
              remainingDisplayUnit: FoodUnit.g,
            },
            {
              dateAdded: new Date(new Date().getTime() - 3 * DAY).toISOString(),
              dateExpiring: new Date(new Date().getTime() + 2 * DAY).toISOString(),
              sizeInGrams: 200,
              sizeDisplayUnit: FoodUnit.g,
              remainingInGrams: 69,
              remainingDisplayUnit: FoodUnit.g,
            },
            {
              dateAdded: new Date(new Date().getTime() - 2 * DAY).toISOString(),
              dateExpiring: new Date(new Date().getTime() - DAY).toISOString(),
              sizeInGrams: 200,
              sizeDisplayUnit: FoodUnit.g,
              remainingDisplayUnit: FoodUnit.g,
            },
          ],
        },
        {
          name: 'Some variation',
          counter: '📦',
          portionSizeInGrams: 1000,
          portionSizeDisplayUnit: FoodUnit.kg,
          nutrients: [
            {
              valueInGrams: 12,
              valueDisplayUnit: NutrientUnit.g,
              nutrientId: proteinId,
            },
            {
              valueInGrams: 12,
              valueDisplayUnit: NutrientUnit.g,
              nutrientId: fatsId,
            },
            {
              valueInGrams: 12,
              valueDisplayUnit: NutrientUnit.g,
              nutrientId: carbsId,
            },
          ],
          portions: [
            {
              sizeInGrams: 200,
              sizeDisplayUnit: FoodUnit.g,
              remainingDisplayUnit: FoodUnit.g,
            },
          ],
        },
      ],
    },
    {
      name: 'Chicken breast',
      description: 'Without skin',
      variations: [
        {
          name: 'Default',
          counter: '🍖',
          nutrients: [
            {
              valueInGrams: 22.5,
              valueDisplayUnit: NutrientUnit.g,
              nutrientId: proteinId,
            },
            {
              valueInGrams: 1.93,
              valueDisplayUnit: NutrientUnit.g,
              nutrientId: fatsId,
            },
            {
              valueInGrams: 0,
              valueDisplayUnit: NutrientUnit.g,
              nutrientId: carbsId,
            },
            {
              valueInGrams: 3.6,
              valueDisplayUnit: NutrientUnit.g,
              nutrientId: nitrogenId,
            },
            {
              valueInGrams: 0.004,
              valueDisplayUnit: NutrientUnit.mg,
              nutrientId: calciumId,
            },
            {
              valueInGrams: 0.00035,
              valueDisplayUnit: NutrientUnit.mg,
              nutrientId: ironId,
            },
            {
              valueInGrams: 0.0262,
              valueDisplayUnit: NutrientUnit.mg,
              nutrientId: magnesiumId,
            },
            {
              valueInGrams: 0.33,
              valueDisplayUnit: NutrientUnit.mg,
              nutrientId: potassiumId,
            },
          ],
          portions: [
            {
              dateAdded: new Date(new Date().getTime() - DAY).toISOString(),
              dateExpiring: new Date(new Date().getTime() + 3 * HOUR).toISOString(),
              sizeInGrams: 200,
              sizeDisplayUnit: FoodUnit.g,
              remainingDisplayUnit: FoodUnit.g,
            },
            {
              dateExpiring: new Date(new Date().getTime() + 3 * DAY).toISOString(),
              sizeInGrams: 200,
              sizeDisplayUnit: FoodUnit.g,
              remainingDisplayUnit: FoodUnit.g,
            },
            {
              dateExpiring: new Date(new Date().getTime() + 3 * DAY).toISOString(),
              sizeInGrams: 200,
              sizeDisplayUnit: FoodUnit.g,
              remainingDisplayUnit: FoodUnit.g,
            },
          ],
        },
      ],
    },
  ];
};
