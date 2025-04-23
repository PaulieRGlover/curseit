import { Module } from '@nestjs/common';
import { FoodsController } from './foods.controller';
import { FdcModule } from './modules/fdc/fdc.module';
import { FoodsService } from './foods.service';
import { CacheModule } from './modules/cache/cache.module';
import { DietPrismaClient } from '@curseit/diet-prisma';

@Module({
  imports: [FdcModule, CacheModule],
  controllers: [FoodsController],
  providers: [
    FoodsService,
    {
      provide: 'PRISMA_CLIENT',
      useValue: DietPrismaClient,
    },
  ],
})
export class FoodsModule {}
