import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { DietPrismaClient } from '@curseit/diet-prisma';

@Module({
  providers: [
    CacheService,
    {
      provide: 'PRISMA_CLIENT',
      useValue: DietPrismaClient,
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
