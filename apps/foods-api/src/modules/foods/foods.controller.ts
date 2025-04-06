import { Controller, Get, Query } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { SearchDto } from './dto/search.dto';

@Controller('foods')
export class FoodsController {
  constructor(private foodsService: FoodsService) {}

  @Get()
  foods() {
    return this.foodsService.getFoods();
  }

  @Get('search')
  search(@Query() query: SearchDto) {
    return this.foodsService.searchFoods(query.name);
  }
}
