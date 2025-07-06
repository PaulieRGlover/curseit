import { Injectable } from '@nestjs/common';

import { FoodsPrismaService } from '../prisma/foods-prisma.service';

import { Food, FoodsWithNutrientsDto } from './dto/foods.dto';
import { SearchDto } from './dto/search.dto';
import { CacheService } from './modules/cache/cache.service';
import { FdcService } from './modules/fdc/fdc.service';
import { dietPrismaFoodToFood } from './transformers/diet-prisma-food-to-food.transformer';
import { fdcFoodToFoodWithNutrients } from './transformers/fdc-food-to-food-with-nutrients.transformer';
import { foodWithNutrientsToFood } from './transformers/food-with-nutrients-to-food.transformer';
import { foodWithNutrientsToFoodsPrismaFoodCreate } from './transformers/food-with-nutrients-to-foods-prisma-food-create.transformer';

@Injectable()
export class FoodsService {
  constructor(
    private readonly foodsPrismaService: FoodsPrismaService,
    private readonly fdcService: FdcService,
    private readonly cacheService: CacheService,
  ) {}

  private async saveAndCacheFoods(
    foodsWithNutrientsDto: FoodsWithNutrientsDto,
    // searchDto: SearchDto,
  ) {
    const { foodsWithNutrients } = foodsWithNutrientsDto;

    const foodsPrisma = await Promise.allSettled(
      foodsWithNutrients.map(foodWithNutrients => {
        return this.foodsPrismaService.food.create({
          data: foodWithNutrientsToFoodsPrismaFoodCreate(foodWithNutrients),
        });
      }),
    );

    // const successes = foodsPrisma
    //   .filter(result => result.status === 'fulfilled')
    //   .map(result => result.value);

    const failures = foodsPrisma
      .filter(result => result.status === 'rejected')
      .map(result => result.reason);
      
    console.log(`failures: `, failures);

    // this.cacheService.createSearchCache(searchDto, successes);
  }

  async searchFoods(searchDto: SearchDto): Promise<Food[]> {
    const foodsPrismaFromCache = await this.cacheService.getSearchCache(searchDto);
    if (foodsPrismaFromCache) {
      return foodsPrismaFromCache.map(dietPrismaFoodToFood);
    }

    const fdcFoods = await this.fdcService.searchFoods(searchDto);
    const foodsWithNutrients = fdcFoods.map(fdcFoodToFoodWithNutrients);

    this.saveAndCacheFoods({ foodsWithNutrients });

    return foodsWithNutrients.map(foodWithNutrientsToFood);
  }

  async getNutrients() {
    return this.foodsPrismaService.nutrient.findMany({ where: {} });
  }
}
