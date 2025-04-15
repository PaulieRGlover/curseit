import { Module } from '@nestjs/common';
import { FoodsController } from './foods.controller';
import { FoodsPrismaClient } from '@curseit/foods-prisma';
import { FdcModule } from './modules/fdc/fdc.module';
import { FoodsService } from './foods.service';
import { CacheModule } from './modules/cache/cache.module';

@Module({
  imports: [FdcModule, CacheModule],
  controllers: [FoodsController],
  providers: [
    FoodsService,
    {
      provide: 'PRISMA_CLIENT',
      useValue: FoodsPrismaClient,
    },
  ],
})
export class FoodsModule {}
