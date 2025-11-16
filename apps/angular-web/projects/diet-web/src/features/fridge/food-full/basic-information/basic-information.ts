import { Component, ViewEncapsulation, effect, inject, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

import { CiuiCheckbox, CiuiInput, CiuiTextarea } from '@curseit/ciui';
import { Nullable } from '@curseit/types';

import { Food } from '../../types/external/food.types';
import { FridgeService } from '../../fridge.service';
import { FoodStore } from '../../store/food.store';
import { FoodsInternalValidationService } from '../../validation/foods-internal-validation.service';

@Component({
  selector: 'cid-basic-information',
  imports: [ReactiveFormsModule, CiuiInput, CiuiTextarea, CiuiCheckbox],
  templateUrl: './basic-information.html',
  styleUrl: './basic-information.scss',
  host: {
    class: 'cid-food-basic-information',
  },
  encapsulation: ViewEncapsulation.None,
})
export class CidBasicInformation {
  fridgeService = inject(FridgeService);
  foodsValidationService = inject(FoodsInternalValidationService);
  foodStore = inject(FoodStore);

  foodInput = new FormGroup({
    name: new FormControl('', { asyncValidators: this.foodsValidationService.name }),
    description: new FormControl(''),
    perishable: new FormControl(true),
  });

  constructor() {
    effect(() => {
      const food = this.foodStore.food();

      untracked(() => {
        this.handleFoodUpdate(food);
      });
    });
  }

  ngAfterViewInit() {
    this.handleFoodUpdate(this.foodStore.food());
  }

  handleFoodUpdate(food: Nullable<Food>) {
    if (!food) {
      return;
    }

    this.foodInput.setValue({
      name: food.name,
      description: food.description,
      perishable: food.perishable,
    });
  }

  async handleFoodInputChange() {
    const foodUpdate = await this.foodsValidationService.food(this.foodInput.value);
    if (!foodUpdate) {
      return;
    }

    this.fridgeService.updateFood(foodUpdate);
  }
}
