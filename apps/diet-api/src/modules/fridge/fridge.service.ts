import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { FoodDto, FoodSchema, FoodsWithPortionsDto, FoodsWithPortionsSchema, UserDto } from '@/dto';

import { PrismaService } from '../prisma/prisma.service';
import { ValidationService } from '../validation/validation.service';

import { CreateFoodDto } from './dto/fridge.dto';
import { Prisma } from '@curseit/diet-orm';
import { PRISMA_ERRORS } from '@curseit/prisma-errors';
import { FRIDGE_MESSAGES } from './messages/fridge.messages';

@Injectable()
export class FridgeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  async getUserFoods(userId: UserDto['id']): Promise<FoodsWithPortionsDto> {
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

  async createUserFood(userId: UserDto['id'], dto: CreateFoodDto): Promise<FoodDto> {
    let food;
    try {
      food = await this.prismaService.food.create({
        data: {
          ...dto,
          user: {
            connect: { id: userId },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERRORS.UNIQUE_CONSTRAINT_FAILED) {
          throw new ConflictException(FRIDGE_MESSAGES.FOOD_EXISTS);
        }
      }

      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof FoodSchema>(FoodSchema, food);
  }
}
