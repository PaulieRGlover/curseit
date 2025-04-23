import { FoodsPrismaClient } from '@curseit/foods-prisma';
import { Inject, Injectable } from '@nestjs/common';
import { FdcService } from './modules/fdc/fdc.service';
import { CacheService } from './modules/cache/cache.service';
import { SearchDto } from './dto/search.dto';
import {
  foodWithNutrientsToFoodsPrismaFoodCreate,
} from './transformers/food-with-nutrients-to-foods-prisma-food-create.transformer';
import { Food, FoodsWithNutrientsDto } from './dto/foods.dto';
import {
  fdcFoodToFoodWithNutrients,
} from './transformers/fdc-food-to-food-with-nutrients.transformer';
import { foodsPrismaFoodToFood } from './transformers/foods-prisma-food-to-food.transformer';
import {
  foodWithNutrientsToFood,
} from './transformers/food-with-nutrients-to-food.transformer';

@Injectable()
export class FoodsService {
  constructor(
    @Inject('PRISMA_CLIENT')
    private readonly prismaClient: typeof FoodsPrismaClient,
    private readonly fdcService: FdcService,
    private readonly cacheService: CacheService,
  ) {}

  private async saveAndCacheFoods(
    foodsWithNutrientsDto: FoodsWithNutrientsDto,
    searchDto: SearchDto,
  ) {
    const { foodsWithNutrients } = foodsWithNutrientsDto;

    const foodsPrisma = await this.prismaClient.$transaction(
      foodsWithNutrients.map(foodWithNutrients => {
        return this.prismaClient.food.create({
          data: foodWithNutrientsToFoodsPrismaFoodCreate(foodWithNutrients),
        });
      }),
    );

    this.cacheService.createSearchCache(searchDto, foodsPrisma);
  }

  async searchFoods(searchDto: SearchDto): Promise<Food[]> {
    const foodsPrismaFromCache = await this.cacheService.getSearchCache(searchDto);
    if (foodsPrismaFromCache) {
      return foodsPrismaFromCache.map(foodsPrismaFoodToFood);
    }

    const fdcFoods = await this.fdcService.searchFoods(searchDto);
    const foodsWithNutrients = fdcFoods.map(fdcFoodToFoodWithNutrients);

    this.saveAndCacheFoods({ foodsWithNutrients }, searchDto);

    return foodsWithNutrients.map(foodWithNutrientsToFood);
  }
}
