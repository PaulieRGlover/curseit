import { FoodWithNutrients } from '../dto/foods.dto';

export const foodWithNutrientsToFoodsPrismaFoodCreate = (
  foodWithNutrients: FoodWithNutrients,
) => {
  return {
    id: foodWithNutrients.id,
    name: foodWithNutrients.name,
    provider: foodWithNutrients.provider,
    nutrients: {
      create: foodWithNutrients.nutrients.map(nutrient => {
        return {
          value: nutrient.value,
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
