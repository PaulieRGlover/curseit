import { Module } from '@nestjs/common';
import { FoodsController } from './foods.controller';
import { FoodsPrismaClient } from '@curseit/foods-prisma';
import { FdcModule } from './fdc/fdc.module';
import { FoodsService } from './foods.service';

@Module({
  imports: [FdcModule],
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
