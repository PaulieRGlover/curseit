import {
  Component,
  HostBinding,
  ViewEncapsulation,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CiuiCheckbox, CiuiInput, CiuiTextarea } from '@curseit/ciui';
import { Nullable } from '@curseit/types';

import { FridgeService } from '../../fridge.service';
import { FoodStore } from '../../store/food.store';
import { Food } from '../../types/external/food.types';
import { FoodValidationService } from '../../validation/internal/food-validation.service';

@Component({
  selector: 'cid-food-basic-info',
  imports: [ReactiveFormsModule, CiuiInput, CiuiTextarea, CiuiCheckbox],
  templateUrl: './food-basic-info.html',
  styleUrl: './food-basic-info.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidFoodBasicInfo {
  fridgeService = inject(FridgeService);
  foodValidationService = inject(FoodValidationService);
  foodStore = inject(FoodStore);

  foodInput = new FormGroup({
    name: new FormControl('', { asyncValidators: this.foodValidationService.name }),
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
    const foodUpdate = await this.foodValidationService.food(this.foodInput.value);
    if (!foodUpdate) {
      return;
    }

    this.fridgeService.updateFood(foodUpdate);
  }

  @HostBinding('class')
  hostClass = 'cid-food-basic-info';
}
