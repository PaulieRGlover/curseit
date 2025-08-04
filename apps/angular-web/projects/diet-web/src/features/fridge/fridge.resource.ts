import { Injectable, inject } from '@angular/core';

import { Get, Post, Resource, UseAuthorization, UseValidation } from '@curseit/resource';

import { API } from '@/core/constants/api.constants';
import { DietResource } from '@/core/diet.resource';

import { FoodCreateDto } from './dto/internal/food.dto';

@Injectable({ providedIn: 'root' })
@Resource(API.FRIDGE.BASE)
@UseAuthorization()
export class FridgeResource extends DietResource {
  // validation = inject()

  @Get(API.FRIDGE.FOODS)
  // @UseValidation('foods')
  async getFoods() {}

  @Post(API.FRIDGE.FOOD)
  async createFood(dto: FoodCreateDto) {}
}
