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

import { FridgeService } from '../../fridge.service';
import { FoodStore } from '../../store/food.store';
import { FoodValidationService } from '../../validation/internal/food-validation.service';

import { foodToFoodBasicInfoModel } from './transformers/food-to-food-basic-info-model.transformer';

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

  foodForm = new FormGroup({
    name: new FormControl('', { asyncValidators: this.foodValidationService.name }),
    description: new FormControl(''),
    perishable: new FormControl(true),
  });

  constructor() {
    effect(() => {
      const food_ = this.foodStore.food();

      untracked(() => {
        if (food_) {
          this.foodForm.setValue(foodToFoodBasicInfoModel(food_));
        }
      });
    });
  }

  async handleChange() {
    const foodUpdate = await this.foodValidationService.foodUpdate(this.foodForm.value);
    if (!foodUpdate) {
      return;
    }

    this.fridgeService.updateFood(foodUpdate);
  }

  @HostBinding('class')
  hostClass = 'cid-food-basic-info';
}
