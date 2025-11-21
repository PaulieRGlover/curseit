import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { GetUser } from '@/decorators';
import { UserDto } from '@/dto';
import { AccessJwtGuard } from '@/guards';

import {
  FoodDto,
  FoodInputDto,
  VariationCreateDto,
  VariationDto,
  VariationNutrientCreateDto,
  VariationNutrientDto,
  VariationNutrientUpdateDto,
  VariationUpdateDto,
} from './dto/fridge.dto';
import { FridgeService } from './fridge.service';

@UseGuards(AccessJwtGuard)
@Controller('fridge')
export class FridgeController {
  constructor(private fridgeService: FridgeService) {}

  @Get('foods')
  getFoods(@GetUser('id') userId: UserDto['id']) {
    return this.fridgeService.getUserFoods(userId);
  }

  @Post('foods')
  createFood(@GetUser('id') userId: UserDto['id'], @Body() dto: FoodInputDto) {
    return this.fridgeService.createUserFood(userId, dto);
  }

  @Get('foods/:foodId')
  getFood(@GetUser('id') userId: UserDto['id'], @Param('foodId') foodId: FoodDto['id']) {
    return this.fridgeService.getUserFood(userId, foodId);
  }

  @Patch('foods/:foodId')
  updateFood(
    @GetUser('id') userId: UserDto['id'],
    @Param('foodId') foodId: FoodDto['id'],
    @Body() dto: FoodInputDto,
  ) {
    return this.fridgeService.updateUserFood(userId, foodId, dto);
  }

  @Get('foods/:foodId/variations')
  getVariations(@GetUser('id') userId: UserDto['id'], @Param('foodId') foodId: FoodDto['id']) {
    return this.fridgeService.getUserFoodVariations(userId, foodId);
  }

  @Post('foods/:foodId/variations')
  createVariation(
    @GetUser('id') userId: UserDto['id'],
    @Param('foodId') foodId: FoodDto['id'],
    @Body() dto: VariationCreateDto,
  ) {
    return this.fridgeService.createUserFoodVariation(userId, foodId, dto);
  }

  @Get('foods/:foodId/portions')
  getPortions(@GetUser('id') userId: UserDto['id'], @Param('foodId') foodId: FoodDto['id']) {
    return this.fridgeService.getUserFoodPortions(userId, foodId);
  }

  @Get('variations/:variationId')
  getVariation(
    @GetUser('id') userId: UserDto['id'],
    @Param('variationId') variationId: VariationDto['id'],
  ) {
    return this.fridgeService.getUserFoodVariation(userId, variationId);
  }

  @Patch('variations/:variationId')
  updateVariation(
    @GetUser('id') userId: UserDto['id'],
    @Param('variationId') variationId: VariationDto['id'],
    @Body() dto: VariationUpdateDto,
  ) {
    return this.fridgeService.updateUserFoodVariation(userId, variationId, dto);
  }

  @Delete('variations/:variationId')
  deleteVariation(
    @GetUser('id') userId: UserDto['id'],
    @Param('variationId') variationId: VariationDto['id'],
  ) {
    return this.fridgeService.deleteUserFoodVariation(userId, variationId);
  }

  @Post('variations/:variationId/nutrients')
  createNutrient(
    @GetUser('id') userId: UserDto['id'],
    @Param('variationId') variationId: VariationDto['id'],
    @Body() dto: VariationNutrientCreateDto,
  ) {
    return this.fridgeService.createUserFoodVariationNutrient(userId, variationId, dto);
  }

  @Patch('variations/:variationId/nutrients/:nutrientId')
  updateNutrient(
    @GetUser('id') userId: UserDto['id'],
    @Param('variationId') variationId: VariationDto['id'],
    @Param('nutrientId') nutrientId: VariationNutrientDto['id'],
    @Body() dto: VariationNutrientUpdateDto,
  ) {
    return this.fridgeService.updateUserFoodVariationNutrient(userId, variationId, nutrientId, dto);
  }

  @Delete('variations/:variationId/nutrients/:nutrientId')
  deleteNutrient(
    @GetUser('id') userId: UserDto['id'],
    @Param('variationId') variationId: VariationDto['id'],
    @Param('nutrientId') nutrientId: VariationNutrientDto['id'],
  ) {
    return this.fridgeService.deleteUserFoodVariationNutrient(userId, variationId, nutrientId);
  }

  @Get('variations/:variationId/nutrients-not-repeated')
  getNutrientsNotRepeated(
    @GetUser('id') userId: UserDto['id'],
    @Param('variationId') variationId: VariationDto['id'],
    @Query('search') search?: string,
  ) {
    return this.fridgeService.getNutrientsNotRepeated(userId, variationId, search);
  }
}
