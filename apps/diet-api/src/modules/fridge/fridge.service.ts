import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@curseit/diet-orm';
import { PRISMA_ERRORS, PRISMA_MESSAGES } from '@curseit/prisma-errors';

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
  NutrientsAbridgedDto,
  NutrientsAbridgedSchema,
  PortionBulkCreateDto,
  PortionBulkDeleteDto,
  PortionCreateDto,
  PortionDto,
  PortionSchemaRaw,
  PortionUpdateDto,
  PortionsDto,
  PortionsSchema,
  VariationCreateDto,
  VariationDto,
  VariationNutrientCreateDto,
  VariationNutrientDto,
  VariationNutrientSchema,
  VariationNutrientUpdateDto,
  VariationSchema,
  VariationUpdateDto,
  VariationWithNutrientsDto,
  VariationWithNutrientsSchema,
  VariationsDto,
  VariationsSchema,
} from './dto/fridge.dto';
import { FRIDGE_MESSAGES } from './messages/fridge.messages';
import { foodToFoodWithPortions } from './transformers/food-to-food-with-portions.transformer';
import { nutrientToNutrientAbridged } from './transformers/nutrient-to-nutrient-abridged.transformer';
import { portionToPortionDto } from './transformers/portion-to-portion-dto.transformer';
import { variationNutrientToDto } from './transformers/variation-nutrient-to-dto.transformer';

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

  async getUserFoodVariations(
    userId: UserDto['id'],
    foodId: FoodDto['id'],
  ): Promise<VariationsDto> {
    let variations;
    try {
      variations = await this.prismaService.foodVariation.findMany({
        where: { food: { id: foodId, userId } },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof VariationsSchema>(VariationsSchema, variations);
  }

  async createUserFoodVariation(
    userId: UserDto['id'],
    foodId: FoodDto['id'],
    dto: VariationCreateDto,
  ): Promise<VariationDto> {
    let variation;
    try {
      variation = await this.prismaService.foodVariation.create({
        data: {
          food: { connect: { user: { id: userId }, id: foodId } },
          ...dto,
        },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof VariationSchema>(VariationSchema, variation);
  }

  async getUserFoodPortions(userId: UserDto['id'], foodId: FoodDto['id']): Promise<PortionsDto> {
    let portions;
    try {
      portions = await this.prismaService.foodPortion.findMany({
        where: { foodVariation: { food: { id: foodId, userId } } },
        include: { foodVariation: { select: { id: true, counter: true } } },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof PortionsSchema>(
      PortionsSchema,
      portions.map(portionToPortionDto),
    );
  }

  async createUserFoodPortion(
    userId: UserDto['id'],
    dto: PortionCreateDto,
  ): Promise<PortionDto> {
    const { variationId, ...dtoWithoutVariationId } = dto;
    let variation;
    try {
      variation = await this.prismaService.foodVariation.findUnique({
        where: { id: variationId, food: { user: { id: userId } } },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    if (!variation) {
      throw new NotFoundException(FRIDGE_MESSAGES.NO_VARIATION);
    }

    const sizeInGrams = variation.portionSizeInGrams;
    const sizeDisplayUnit = variation.portionSizeDisplayUnit;

    let portion;
    try {
      portion = await this.prismaService.foodPortion.create({
        data: {
          foodVariation: {
            connect: { id: variationId },
          },
          sizeInGrams,
          sizeDisplayUnit,
          ...dtoWithoutVariationId,
        },
        include: { foodVariation: { select: { id: true, counter: true } } },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof PortionSchemaRaw>(
      PortionSchemaRaw,
      portionToPortionDto(portion),
    );
  }

  async updateUserFoodPortion(
    userId: UserDto['id'],
    portionId: PortionDto['id'],
    dto: PortionUpdateDto,
  ): Promise<PortionDto> {
    let portion;
    try {
      const { variationId, ...update } = dto;

      portion = await this.prismaService.foodPortion.update({
        where: {
          id: portionId,
          foodVariation: { food: { userId } },
        },
        data: {
          foodVariation: {
            connect: { id: variationId },
          },
          ...update,
        },
        include: { foodVariation: { select: { id: true, counter: true } } },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof PortionSchemaRaw>(
      PortionSchemaRaw,
      portionToPortionDto(portion),
    );
  }

  async deleteUserFoodPortion(
    userId: UserDto['id'],
    portionId: PortionDto['id'],
  ): Promise<PortionDto> {
    let portion;
    try {
      portion = await this.prismaService.foodPortion.delete({
        where: {
          id: portionId,
          foodVariation: { food: { userId } },
        },
        include: { foodVariation: { select: { id: true, counter: true } } },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof PortionSchemaRaw>(
      PortionSchemaRaw,
      portionToPortionDto(portion),
    );
  }

  async bulkCreateUserFoodPortions(
    userId: UserDto['id'],
    dto: PortionBulkCreateDto,
  ): Promise<PortionsDto> {
    const variationsIds = dto.map(({ variationId }) => variationId);
    let variations;
    try {
      variations = await this.prismaService.foodVariation.findMany({
        where: { id: { in: variationsIds }, food: { user: { id: userId } } },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    let portions;
    try {
      portions = await this.prismaService.foodPortion.createManyAndReturn({
        data: dto.map(portion => {
          const { variationId, ...portionWithoutVariationId } = portion;

          const variation = variations.find(({ id }) => id === variationId);
          if (!variation) {
            throw new NotFoundException(FRIDGE_MESSAGES.NO_VARIATION);
          }

          let sizeInGrams;
          let sizeDisplayUnit;
          if (portion.sizeInGrams && portion.sizeDisplayUnit) {
            sizeInGrams = portion.sizeInGrams;
            sizeDisplayUnit = portion.sizeDisplayUnit;
          } else {
            sizeInGrams = variation.portionSizeInGrams;
            sizeDisplayUnit = variation.portionSizeDisplayUnit;
          }

          return {
            foodVariationId: variationId,
            sizeInGrams,
            sizeDisplayUnit,
            ...portionWithoutVariationId,
          };
        }),
        include: { foodVariation: { select: { id: true, counter: true } } },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof PortionsSchema>(
      PortionsSchema,
      portions.map(portionToPortionDto),
    );
  }

  async bulkDeleteUserFoodPortions(
    userId: UserDto['id'],
    dto: PortionBulkDeleteDto,
  ): Promise<PortionsDto> {
    const { ids } = dto;
    let portions;
    try {
      const where = {
        id: { in: ids },
        foodVariation: { food: { userId } },
      };
      portions = await this.prismaService.foodPortion.findMany({
        where,
        include: { foodVariation: { select: { id: true, counter: true } } },
      });

      await this.prismaService.foodPortion.deleteMany({ where });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof PortionsSchema>(
      PortionsSchema,
      portions.map(portionToPortionDto),
    );
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
          nutrients: {
            orderBy: { dateAdded: 'asc' },
            include: {
              nutrient: true,
            },
          },
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
      { ...variation, nutrients: variation.nutrients.map(variationNutrientToDto) },
    );
  }

  async updateUserFoodVariation(
    userId: UserDto['id'],
    variationId: VariationDto['id'],
    dto: VariationUpdateDto,
  ): Promise<VariationDto> {
    let variation;
    try {
      variation = await this.prismaService.foodVariation.update({
        where: {
          food: { userId },
          id: variationId,
        },
        data: dto,
      });
    } catch {
      throw new InternalServerErrorException();
    }

    if (!variation) {
      throw new NotFoundException();
    }

    return this.validationService.validate<typeof VariationSchema>(VariationSchema, variation);
  }

  async deleteUserFoodVariation(
    userId: UserDto['id'],
    variationId: VariationDto['id'],
  ): Promise<VariationDto> {
    let variation;
    try {
      variation = await this.prismaService.foodVariation.delete({
        where: {
          food: { userId },
          id: variationId,
        },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    if (!variation) {
      throw new NotFoundException();
    }

    return this.validationService.validate<typeof VariationSchema>(VariationSchema, variation);
  }

  async createUserFoodVariationNutrient(
    userId: UserDto['id'],
    variationId: VariationDto['id'],
    dto: VariationNutrientCreateDto,
  ): Promise<VariationNutrientDto> {
    const variation = await this.getUserFoodVariation(userId, variationId);
    const existingNutrientIds = variation.nutrients.map(({ nutrientId }) => nutrientId);
    if (existingNutrientIds.includes(dto.nutrientId)) {
      throw new ConflictException(FRIDGE_MESSAGES.NUTRIENT_ALREADY_EXISTS);
    }

    let nutrient;
    try {
      nutrient = await this.prismaService.nutrientInFoodVariation.create({
        data: {
          foodVariation: { connect: { id: variationId, food: { userId } } },
          valueInGrams: dto.valueInGrams,
          valueDisplayUnit: dto.valueDisplayUnit,
          nutrient: { connect: { id: dto.nutrientId } },
        },
        include: { nutrient: true },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof VariationNutrientSchema>(
      VariationNutrientSchema,
      variationNutrientToDto(nutrient),
    );
  }

  async updateUserFoodVariationNutrient(
    userId: UserDto['id'],
    variationId: VariationDto['id'],
    nutrientId: VariationNutrientDto['id'],
    dto: VariationNutrientUpdateDto,
  ): Promise<VariationNutrientDto> {
    let nutrient;
    try {
      nutrient = await this.prismaService.nutrientInFoodVariation.update({
        where: {
          id: nutrientId,
          foodVariation: { id: variationId, food: { userId } },
        },
        data: {
          valueInGrams: dto.valueInGrams,
          valueDisplayUnit: dto.valueDisplayUnit,
          nutrient: { connect: { id: dto.nutrientId } },
        },
        include: { nutrient: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_ERRORS.OPERATION_FAILED &&
        error.message.match(PRISMA_MESSAGES.RECORD_TO_UPDATE_NOT_FOUND)
      ) {
        throw new NotFoundException();
      }

      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof VariationNutrientSchema>(
      VariationNutrientSchema,
      variationNutrientToDto(nutrient),
    );
  }

  async deleteUserFoodVariationNutrient(
    userId: UserDto['id'],
    variationId: VariationDto['id'],
    nutrientId: VariationNutrientDto['id'],
  ): Promise<VariationNutrientDto> {
    let nutrient;
    try {
      nutrient = await this.prismaService.nutrientInFoodVariation.delete({
        where: {
          id: nutrientId,
          foodVariation: { id: variationId, food: { userId } },
        },
        include: { nutrient: true },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof VariationNutrientSchema>(
      VariationNutrientSchema,
      variationNutrientToDto(nutrient),
    );
  }

  async getNutrients(
    userId: UserDto['id'],
    search?: string,
    noRepeatIn?: VariationDto['id'],
  ): Promise<NutrientsAbridgedDto> {
    let existingNutrientIds: Array<string> = [];

    if (noRepeatIn) {
      const variation = await this.getUserFoodVariation(userId, noRepeatIn);
      if (!variation) {
        throw new NotFoundException(FRIDGE_MESSAGES.NO_VARIATION);
      }

      existingNutrientIds = variation.nutrients.map(({ nutrientId }) => nutrientId);
    }

    let nutrients;
    try {
      nutrients = await this.prismaService.nutrient.findMany({
        where: search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { shortName: { contains: search, mode: 'insensitive' } },
              ],
              id: { notIn: existingNutrientIds },
            }
          : { id: { notIn: existingNutrientIds } },
        orderBy: {
          externalWeight: 'desc',
        },
        take: 10,
      });

      nutrients = nutrients.map(nutrientToNutrientAbridged);
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof NutrientsAbridgedSchema>(
      NutrientsAbridgedSchema,
      nutrients,
    );
  }
}
