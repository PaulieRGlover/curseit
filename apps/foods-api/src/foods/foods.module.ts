import { Module } from '@nestjs/common';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';
import { FoodsPrismaClient } from '@curseit/foods-prisma';

@Module({
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
