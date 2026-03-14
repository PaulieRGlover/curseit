import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { UserDto } from '@/dto';

import { PrismaService } from '../prisma/prisma.service';
import { ValidationService } from '../validation/validation.service';

import {
  RecipeProjectIngredientBulkDeleteDto,
  RecipeProjectIngredientsCreateDto,
  RecipeProjectIngredientsDto,
  RecipeProjectIngredientsSchema,
  RecipeProjectSchema,
  RecipeProjectUpdateDto,
  RecipeProjectWithIngredientsCreateDto,
  RecipeProjectWithIngredientsSchema,
} from './dto/kitchen.dto';
import { KITCHEN_MESSAGES } from './messages/kitchen.messages';
import { recipeProjectToRecipeProjectWithIngredients } from './transformers/recipe-project-to-recipe-project-with-ingredients';
import { recipeProjectIngredientToDto } from './transformers/recipe-project-ingredient-to-dto';
import { recipeProjectToDto } from './transformers/recipe-project-to-dto';

@Injectable()
export class KitchenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  async getRecipeProject(userId: UserDto['id']) {
    let project;
    try {
      project = await this.prismaService.recipeProject.findFirst({
        where: { userId },
        include: this._recipeProjectWithPortionsInclude,
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return project
      ? this.validationService.validate<typeof RecipeProjectWithIngredientsSchema>(
          RecipeProjectWithIngredientsSchema,
          recipeProjectToRecipeProjectWithIngredients(project),
        )
      : null;
  }

  async createRecipeProject(userId: UserDto['id'], dto: RecipeProjectWithIngredientsCreateDto) {
    const foodPortionIds = dto.ingredients.map(({ foodPortionId }) => foodPortionId);
    let foodPortions;
    try {
      foodPortions = await this.prismaService.foodPortion.findMany({
        where: { id: { in: foodPortionIds }, foodVariation: { food: { user: { id: userId } } } },
        include: { foodVariation: true },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    let project;
    try {
      const { ingredients, ...recipeProject } = dto;
      project = await this.prismaService.recipeProject.create({
        data: {
          userId,
          ...recipeProject,
          ingredients: {
            create: ingredients.map(ingredient => {
              const foodPortion = foodPortions.find(({ id }) => id === ingredient.foodPortionId);
              if (!foodPortion) {
                throw new InternalServerErrorException();
              }

              return {
                foodId: foodPortion.foodVariation.foodId,
                sizeInGrams: foodPortion.sizeInGrams,
                sizeDisplayUnit: foodPortion.sizeDisplayUnit,
                ...ingredient,
              };
            }),
          },
        },
        include: this._recipeProjectWithPortionsInclude,
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof RecipeProjectWithIngredientsSchema>(
      RecipeProjectWithIngredientsSchema,
      recipeProjectToRecipeProjectWithIngredients(project),
    );
  }

  async updateRecipeProject(userId: UserDto['id'], dto: RecipeProjectUpdateDto) {
    let project;
    try {
      project = await this.prismaService.recipeProject.findFirst({ where: { userId } });
      if (!project) {
        throw new NotFoundException();
      }

      project = await this.prismaService.recipeProject.update({
        where: { id: project.id },
        data: dto,
      });
    } catch {
      throw new InternalServerErrorException();
    }
    
    return this.validationService.validate<typeof RecipeProjectSchema>(
      RecipeProjectSchema,
      recipeProjectToDto(project),
    );
  }

  async deleteRecipeProject(userId: UserDto['id']) {
    let project;
    try {
      project = await this.prismaService.recipeProject.findFirst({ where: { userId } });
      if (!project) {
        throw new NotFoundException();
      }

      await this.prismaService.recipeProject.delete({ where: { id: project.id } });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof RecipeProjectSchema>(
      RecipeProjectSchema,
      recipeProjectToDto(project),
    );
  }

  async createRecipeProjectIngredients(
    userId: UserDto['id'],
    dto: RecipeProjectIngredientsCreateDto,
  ): Promise<RecipeProjectIngredientsDto> {
    const recipeProject = await this.prismaService.recipeProject.findFirst({ where: { userId } });
    if (!recipeProject) {
      throw new NotFoundException(KITCHEN_MESSAGES.NO_RECIPE_PROJECT);
    }

    const foodPortionIds = dto.map(({ foodPortionId }) => foodPortionId);
    let foodPortions;
    try {
      foodPortions = await this.prismaService.foodPortion.findMany({
        where: { id: { in: foodPortionIds }, foodVariation: { food: { user: { id: userId } } } },
        include: { foodVariation: true },
      });
    } catch {
      throw new InternalServerErrorException();
    }

    let ingredients;
    try {
      ingredients = await this.prismaService.recipeProjectIngredient.createManyAndReturn({
        data: dto.map(portion => {
          const foodPortion = foodPortions.find(({ id }) => id === portion.foodPortionId);
          if (!foodPortion) {
            throw new InternalServerErrorException();
          }

          return {
            foodId: foodPortion.foodVariation.foodId,
            recipeProjectId: recipeProject.id,
            sizeInGrams: foodPortion.sizeInGrams,
            sizeDisplayUnit: foodPortion.sizeDisplayUnit,
            ...portion,
          };
        }),
        include: this._recipeProjectIngredientInclude,
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof RecipeProjectIngredientsSchema>(
      RecipeProjectIngredientsSchema,
      ingredients.map(recipeProjectIngredientToDto),
    );
  }

  async bulkDeleteRecipeProjectIngredients(
    userId: UserDto['id'],
    dto: RecipeProjectIngredientBulkDeleteDto,
  ): Promise<RecipeProjectIngredientsDto> {
    const recipeProject = await this.prismaService.recipeProject.findFirst({ where: { userId } });
    if (!recipeProject) {
      throw new NotFoundException(KITCHEN_MESSAGES.NO_RECIPE_PROJECT);
    }

    const { ids } = dto;
    let ingredients;
    try {
      const where = { recipeProjectId: recipeProject.id, id: { in: ids } };

      ingredients = await this.prismaService.recipeProjectIngredient.findMany({
        where,
        include: this._recipeProjectIngredientInclude,
      });

      await this.prismaService.recipeProjectIngredient.deleteMany({ where });
    } catch {
      throw new InternalServerErrorException();
    }

    return this.validationService.validate<typeof RecipeProjectIngredientsSchema>(
      RecipeProjectIngredientsSchema,
      ingredients.map(recipeProjectIngredientToDto),
    );
  }
  
  private _recipeProjectIngredientInclude = {
    foodPortion: {
      include: {
        foodVariation: true,
      },
    },
  };

  private _recipeProjectWithPortionsInclude = {
    ingredients: {
      include: this._recipeProjectIngredientInclude,
    },
  };
}
