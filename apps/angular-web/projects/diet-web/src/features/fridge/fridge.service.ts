import { Injectable, inject } from '@angular/core';

import { FoodCreateDto } from './dto/internal/food.dto';

import { FridgeResource } from './fridge.resource';

@Injectable({ providedIn: 'root' })
export class FridgeService {
  fridgeResource = inject(FridgeResource);

  async initialize() {
    const result = await this.fridgeResource.getFoods();
    console.log(`result: `, result);
  }

  async create(food: FoodCreateDto) {
    const result = await this.fridgeResource.createFood(food);
    console.log(`result: `, result);
  };

  private _foods = [];
}
