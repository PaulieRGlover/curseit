import { Injectable } from '@nestjs/common';
import { SearchDto } from '../../dto/search.dto';
import {
  type Food as FoodsPrismaFood,
  type CacheEntry as FoodsPrismaCacheEntry,
} from '@curseit/diet-prisma';
import objectHash from 'object-hash';
import { Nullable } from '@curseit/basic-types';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class CacheService {
  constructor(private readonly db: PrismaService) {}

  private async removeCacheEntry(id: FoodsPrismaCacheEntry['id']) {
    await this.db.cacheEntry.delete({ where: { id } });
  }

  async createSearchCache(
    searchDto: SearchDto,
    foodsPrismaFoods: FoodsPrismaFood[],
  ): Promise<FoodsPrismaCacheEntry> {
    const hash = objectHash(searchDto);

    return await this.db.cacheEntry.create({
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

  async getSearchCache(searchDto: SearchDto): Promise<Nullable<FoodsPrismaFood[]>> {
    const hash = objectHash(searchDto);

    const cacheEntry = await this.db.cacheEntry.findUnique({
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
