import { Injectable } from '@nestjs/common';

import { FoodsWithPortionsDto, FoodsWithPortionsSchema, UserDto } from '@/dto';

import { PrismaService } from '../prisma/prisma.service';
import { ValidationService } from '../validation/validation.service';

@Injectable()
export class FoodService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  async getUserFood(userId: UserDto['id']): Promise<FoodsWithPortionsDto> {
    const foods = await this.prismaService.food.findMany({
      where: { userId },
      include: {
        variations: {
          include: {
            portions: true,
          },
        },
      },
    });
    return this.validationService.validate<typeof FoodsWithPortionsSchema>(
      FoodsWithPortionsSchema,
      foods,
    );
  }
}
