import { Module } from '@nestjs/common';
import { FoodsPrismaService } from './foods-prisma.service.js';

@Module({
  providers: [FoodsPrismaService],
  exports: [FoodsPrismaService],
})
export class FoodsPrismaModule {}
