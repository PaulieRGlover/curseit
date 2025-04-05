import { FoodsPrismaClient } from '@curseit/foods-prisma';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FoodsService {
  constructor(
    @Inject('PRISMA_CLIENT')
    private readonly prismaClient: typeof FoodsPrismaClient,
  ) {}

  getFoods() {
    return this.prismaClient.food.findMany();
  }
}
