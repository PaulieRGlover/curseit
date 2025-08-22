import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { UserDto } from '@/dto';

import { PrismaService } from '../prisma/prisma.service';
import { ValidationService } from '../validation/validation.service';

import {
  FoodDto,
  FoodInputDto,
  FoodSchema,
  FoodWithVariationsDto,
  FoodWithVariationsSchema,
  FoodsWithPortionsDto,
  FoodsWithPortionsSchema,
  NutrientsDto,
  NutrientsSchema,
  VariationDto,
  VariationNutrientDto,
  VariationNutrientInputDto,
  VariationNutrientSchema,
  VariationWithNutrientsDto,
  VariationWithNutrientsSchema,
} from './dto/fridge.dto';
import { foodToFoodWithPortions } from './transformers/food-to-food-with-portions';

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

    const processedFoods = foods.map(foodToFoodWithPortions);

    return this.validationService.validate<typeof FoodsWithPortionsSchema>(
      FoodsWithPortionsSchema,
      processedFoods,
    );
  }

  async getUserFood(userId: UserDto['id'], foodId: FoodDto['id']): Promise<FoodWithVariationsDto> {
    let food;
    try {
      food = await this.prismaService.food.findUnique({
        where: { id: foodId, userId },
        include: {
          variations: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    if (!food) {
      throw new NotFoundException();
    }

    return this.validationService.validate<typeof FoodWithVariationsSchema>(
      FoodWithVariationsSchema,
      food,
    );
  }

  async createUserFood(userId: UserDto['id'], dto: FoodInputDto): Promise<FoodWithVariationsDto> {
    let food;
    try {
      food = await this.prismaService.food.create({
        data: {
          ...dto,
          user: {
            connect: { id: userId },
          },
          variations: {
            create: {
              name: 'Default',
            },
          },
        },
        include: {
          variations: true,
        },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof FoodWithVariationsSchema>(
      FoodWithVariationsSchema,
      food,
    );
  }

  async updateUserFood(
    userId: UserDto['id'],
    foodId: FoodDto['id'],
    dto: FoodInputDto,
  ): Promise<FoodDto> {
    let food;
    try {
      food = await this.prismaService.food.update({
        where: { id: foodId, userId },
        data: dto,
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof FoodSchema>(FoodSchema, food);
  }

  async getUserFoodVariation(
    userId: UserDto['id'],
    variationId: VariationDto['id'],
  ): Promise<VariationWithNutrientsDto> {
    let variation;
    try {
      variation = await this.prismaService.foodVariation.findUnique({
        where: {
          food: { userId },
          id: variationId,
        },
        include: {
          nutrients: true,
        },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    if (!variation) {
      throw new NotFoundException();
    }

    return this.validationService.validate<typeof VariationWithNutrientsSchema>(
      VariationWithNutrientsSchema,
      variation,
    );
  }

  async createUserFoodVariationNutrient(
    userId: UserDto['id'],
    variationId: VariationDto['id'],
    dto: VariationNutrientInputDto,
  ): Promise<VariationNutrientDto> {
    let nutrient;
    try {
      nutrient = await this.prismaService.nutrientInFoodVariation.create({
        data: {
          foodVariation: { connect: { id: variationId, food: { userId } } },
          valueInGrams: dto.valueInGrams,
          valueDisplayUnit: dto.valueDisplayUnit,
          nutrient: { connect: { id: dto.nutrientId } },
        },
        include: {
          foodVariation: true,
          nutrient: true,
        },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof VariationNutrientSchema>(
      VariationNutrientSchema,
      nutrient,
    );
  }

  async getNutrients(search?: string): Promise<NutrientsDto> {
    let nutrients;
    try {
      nutrients = await this.prismaService.nutrient.findMany({
        where: search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { shortName: { contains: search, mode: 'insensitive' } },
          ],
        } : {},
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof NutrientsSchema>(NutrientsSchema, nutrients);
  }
}
