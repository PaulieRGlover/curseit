import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { foodsPrismaConfig } from '../config/foods-prisma.config';
import { FoodsPrismaService } from './foods-prisma.service';

@Module({
  imports: [ConfigModule.forFeature(foodsPrismaConfig)],
  exports: [FoodsPrismaService],
})
export class FoodsPrismaModule {}
