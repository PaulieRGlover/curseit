import { Component, inject } from '@angular/core';

import { FridgeService } from '../fridge.service';
import { CidFoodFull } from '../food-full/food-full';

@Component({
  selector: 'cid-foods',
  imports: [CidFoodFull],
  templateUrl: './foods.html',
})
export class CidFoods {
  fridgeService = inject(FridgeService);

  ngOnInit() {
    this.fridgeService.initialize();
  }
}
