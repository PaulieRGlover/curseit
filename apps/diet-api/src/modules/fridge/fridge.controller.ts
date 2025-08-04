import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { GetUser } from '@/decorators';
import { UserDto } from '@/dto';
import { AccessJwtGuard } from '@/guards';

import { FridgeService } from './fridge.service';
import { CreateFoodDto } from './dto/fridge.dto';

@UseGuards(AccessJwtGuard)
@Controller('fridge')
export class FridgeController {
  constructor(private fridgeService: FridgeService) {}

  @Get('foods')
  getFoods(@GetUser() user: UserDto) {
    return this.fridgeService.getUserFoods(user.id);
  }

  @Post('food')
  createFood(
    @GetUser() user: UserDto,
    @Body() dto: CreateFoodDto,
  ) {
    return this.fridgeService.createUserFood(user.id, dto);
  }
}
