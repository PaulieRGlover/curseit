import { Injectable } from '@nestjs/common';

import objectHash from 'object-hash';

import {
  type CacheEntry as FoodsPrismaCacheEntry,
  type Food as FoodsOrmFood,
} from '@curseit/foods-orm';
import { Nullable } from '@curseit/types';

import { FoodsPrismaService } from '@/modules/prisma/foods-prisma.service';

import { SearchDto } from '../../dto/search.dto';

@Injectable()
export class CacheService {
  constructor(private readonly foodsPrismaService: FoodsPrismaService) {}

  private async removeCacheEntry(id: FoodsPrismaCacheEntry['id']) {
    await this.foodsPrismaService.cacheEntry.delete({ where: { id } });
  }

  async createSearchCache(
    searchDto: SearchDto,
    foodsPrismaFoods: FoodsOrmFood[],
  ) {
    const hash = objectHash(searchDto);

    return await this.foodsPrismaService.cacheEntry.create({
      data: {
        hash,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        foods: {
          createMany: {
            data: foodsPrismaFoods.map(foodsPrismaFood => {
              return {
                foodId: foodsPrismaFood.id,
              };
            }),
          },
        },
      },
    });
  }

  async getSearchCache(searchDto: SearchDto): Promise<Nullable<FoodsOrmFood[]>> {
    const hash = objectHash(searchDto);

    const cacheEntry = await this.foodsPrismaService.cacheEntry.findUnique({
      where: { hash },
      include: {
        foods: {
          include: {
            food: true,
          },
        },
      },
    });

    if (!cacheEntry) {
      return null;
    } else if (cacheEntry.expiresAt < new Date()) {
      this.removeCacheEntry(cacheEntry.id);

      return null;
    } else {
      return cacheEntry.foods.map(({ food }) => food);
    }
  }
}
