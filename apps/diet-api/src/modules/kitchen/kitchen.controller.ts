import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';

import { GetUser } from '@/decorators';
import { UserDto } from '@/dto';
import { AccessJwtGuard } from '@/guards';

import { RecipeProjectIngredientBulkDeleteDto, RecipeProjectIngredientsCreateDto, RecipeProjectWithIngredientsCreateDto } from './dto/kitchen.dto';
import { KitchenService } from './kitchen.service';

@UseGuards(AccessJwtGuard)
@Controller('kitchen')
export class KitchenController {
  constructor(private kitchenService: KitchenService) {}

  @Get('project')
  getProject(@GetUser('id') userId: UserDto['id']) {
    return this.kitchenService.getRecipeProject(userId);
  }

  @Post('project')
  createProject(
    @GetUser('id') userId: UserDto['id'],
    @Body() dto: RecipeProjectWithIngredientsCreateDto,
  ) {
    return this.kitchenService.createRecipeProject(userId, dto);
  }

  @Delete('project')
  deleteProject(@GetUser('id') userId: UserDto['id']) {
    return this.kitchenService.deleteRecipeProject(userId);
  }

  @Post('project/ingredients')
  createProjectIngredients(
    @GetUser('id') userId: UserDto['id'],
    @Body() dto: RecipeProjectIngredientsCreateDto,
  ) {
    return this.kitchenService.createRecipeProjectIngredients(userId, dto);
  }

  @Post('project/ingredients/action/bulk-delete')
  bulkDeleteProjectIngredients(
    @GetUser('id') userId: UserDto['id'],
    @Body() dto: RecipeProjectIngredientBulkDeleteDto,
  ) {
    return this.kitchenService.bulkDeleteRecipeProjectIngredients(userId, dto);
  }
}
