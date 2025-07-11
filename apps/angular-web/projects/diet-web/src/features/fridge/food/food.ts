import { Component, input } from '@angular/core';

@Component({
  selector: 'cid-food',
  templateUrl: './food.html',
})
export class Food {
  foodId = input.required<string>();
}
