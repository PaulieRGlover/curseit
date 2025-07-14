import { Injectable, inject } from '@angular/core';

import { FoodsResource } from './foods.resource';

@Injectable({ providedIn: 'root' })
export class FoodsService {
  foodsResource = inject(FoodsResource);

  async initialize() {
    const result = await this.foodsResource.getFoods();
    console.log(`result: `, result);
  }

  private _foods = [];
}
