import { FoodWithNutrients } from '../dto/foods.dto';

export const foodWithNutrientsToFoodsPrismaFoodCreate = (foodWithNutrients: FoodWithNutrients) => {
  const {
    id,
    name,
    provider,
    providerId,
    providerCategory,
    providerSubcategory,
  } = foodWithNutrients;
  return {
    id,
    name,
    provider,
    providerId,
    providerCategory,
    providerSubcategory,
    nutrients: {
      create: foodWithNutrients.nutrients.map(nutrient => {
        return {
          valueInGrams: nutrient.valueInGrams,
          nutrient: {
            connectOrCreate: {
              where: { name: nutrient.name },
              create: {
                name: nutrient.name,
              },
            },
          },
        };
      }),
    },
  };
};
