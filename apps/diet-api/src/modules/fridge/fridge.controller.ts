import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { GetUser } from '@/decorators';
import { UserDto } from '@/dto';
import { AccessJwtGuard } from '@/guards';

import { FoodDto, FoodInputDto, VariationDto, VariationNutrientInputDto } from './dto/fridge.dto';
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

  @Get('variations/:variationId')
  getVariation(
    @GetUser('id') userId: UserDto['id'],
    @Param('variationId') variationId: VariationDto['id'],
  ) {
    return this.fridgeService.getUserFoodVariation(userId, variationId);
  }

  @Post('variations/:variationId/nutrients')
  createNutrient(
    @GetUser('id') userId: UserDto['id'],
    @Param('variationId') variationId: VariationDto['id'],
    @Body() dto: VariationNutrientInputDto,
  ) {
    return this.fridgeService.createUserFoodVariationNutrient(userId, variationId, dto);
  }

  @Get('nutrients')
  getNutrients(
    @Query('search') search?: string,
  ) {
    return this.fridgeService.getNutrients(search);
  }
}
