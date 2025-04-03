import { FoodsPrismaService } from '@affable-apps/foods-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private foodsPrismaService: FoodsPrismaService) {}

  health() {
    return 'ok';
  }

  getSomeFood() {
    return this.foodsPrismaService.food.findMany();
  }
}
