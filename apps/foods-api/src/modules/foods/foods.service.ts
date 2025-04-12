import { FoodsPrismaClient } from '@curseit/foods-prisma';
import { Inject, Injectable } from '@nestjs/common';
import { FdcService } from './modules/fdc/fdc.service';

@Injectable()
export class FoodsService {
  constructor(
    @Inject('PRISMA_CLIENT')
    private readonly prismaClient: typeof FoodsPrismaClient,
    private readonly fdcService: FdcService,
  ) {}

  getFoods() {
    return this.prismaClient.food.findMany();
  }

  async searchFoods(name: string) {
    const foods = await this.fdcService.searchFoods(name);

    return this.prismaClient.food.findMany({
      where: { name },
    });
  }
}
