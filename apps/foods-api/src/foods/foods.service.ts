import { FoodsPrismaClient } from '@curseit/foods-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FoodsService {
  getFoods() {
    return FoodsPrismaClient.food.findMany();
  }
}
