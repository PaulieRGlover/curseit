import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { FoodsPrismaClient } from '@curseit/foods-prisma';

@Module({
  providers: [
    CacheService,
    {
      provide: 'PRISMA_CLIENT',
      useValue: FoodsPrismaClient,
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
