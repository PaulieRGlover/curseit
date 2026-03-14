import { Controller, Get, Query } from '@nestjs/common';
import { FoodApiService } from './food-api.service';
import { GetFoodDto, SearchDto } from './dto/search.dto';

@Controller('foods')
export class FoodApiController {
  constructor(private foodApiService: FoodApiService) {}

  @Get('search')
  search(@Query() query: SearchDto) {
    return this.foodApiService.searchFoods(query);
  }

  @Get('nutrients')
  getNutrients() {
    return this.foodApiService.getNutrients();
  }

  @Get('food')
  getFood(@Query() query: GetFoodDto) {
    return this.foodApiService.getFood(query);
  }
}
