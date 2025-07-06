import { Controller, Get, Query } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { SearchDto } from './dto/search.dto';

@Controller('foods')
export class FoodsController {
  constructor(private foodsService: FoodsService) {}

  @Get('search')
  search(@Query() query: SearchDto) {
    return this.foodsService.searchFoods(query);
  }

  @Get('nutrients')
  getNutrients() {
    return this.foodsService.getNutrients();
  }
}
