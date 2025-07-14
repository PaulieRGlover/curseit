import { Component, inject } from '@angular/core';

import { FoodsService } from './foods.service';

@Component({
  selector: 'cid-foods',
  templateUrl: './foods.html',
})
export class Foods {
  foodsService = inject(FoodsService);

  ngOnInit() {
    this.foodsService.initialize();
  }
}
