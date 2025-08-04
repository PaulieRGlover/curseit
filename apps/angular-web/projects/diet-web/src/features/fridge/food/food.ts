import { Component, input } from '@angular/core';

@Component({
  selector: 'cid-food',
  templateUrl: './food.html',
})
export class CidFood {
  foodId = input.required<string>();
}
