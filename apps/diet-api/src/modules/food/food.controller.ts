import { Controller, Get } from '@nestjs/common';
import { FoodService } from './food.service';
import { GetUser } from '@/decorators';
import { UserDto } from '@/dto';

@Controller('food')
export class FoodController {
  constructor(private foodService: FoodService) {}

  @Get()
  getFood(@GetUser() user: UserDto) {
    return this.foodService.getUserFood(user.id);
  }
}
