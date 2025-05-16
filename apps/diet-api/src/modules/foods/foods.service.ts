import { Injectable } from '@nestjs/common';
import { FdcService } from './modules/fdc/fdc.service';
import { CacheService } from './modules/cache/cache.service';
import { SearchDto } from './dto/search.dto';
import { foodWithNutrientsToFoodsPrismaFoodCreate } from './transformers/food-with-nutrients-to-foods-prisma-food-create.transformer';
import { Food, FoodsWithNutrientsDto } from './dto/foods.dto';
import { fdcFoodToFoodWithNutrients } from './transformers/fdc-food-to-food-with-nutrients.transformer';
import { dietPrismaFoodToFood } from './transformers/diet-prisma-food-to-food.transformer';
import { foodWithNutrientsToFood } from './transformers/food-with-nutrients-to-food.transformer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FoodsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fdcService: FdcService,
    private readonly cacheService: CacheService,
  ) {}

  private async saveAndCacheFoods(
    foodsWithNutrientsDto: FoodsWithNutrientsDto,
    searchDto: SearchDto,
  ) {
    const { foodsWithNutrients } = foodsWithNutrientsDto;

    const foodsPrisma = await this.prismaService.$transaction(
      foodsWithNutrients.map((foodWithNutrients) => {
        return this.prismaService.food.create({
          data: foodWithNutrientsToFoodsPrismaFoodCreate(foodWithNutrients),
        });
      }),
    );

    this.cacheService.createSearchCache(searchDto, foodsPrisma);
  }

  async searchFoods(searchDto: SearchDto): Promise<Food[]> {
    const foodsPrismaFromCache = await this.cacheService.getSearchCache(searchDto);
    if (foodsPrismaFromCache) {
      return foodsPrismaFromCache.map(dietPrismaFoodToFood);
    }

    const fdcFoods = await this.fdcService.searchFoods(searchDto);
    const foodsWithNutrients = fdcFoods.map(fdcFoodToFoodWithNutrients);

    this.saveAndCacheFoods({ foodsWithNutrients }, searchDto);

    return foodsWithNutrients.map(foodWithNutrientsToFood);
  }
}
