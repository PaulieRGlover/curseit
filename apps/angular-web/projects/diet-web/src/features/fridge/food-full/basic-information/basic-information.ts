import { Component, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

import { CiuiCheckbox, CiuiInput, CiuiTextarea } from '@curseit/ciui';
import { Nullable } from '@curseit/types';

import { Food } from '../../dto/external/food.dto';
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

  ngAfterViewInit() {
    this._foodSubscription = this.foodStore.food$.subscribe(this.handleFoodUpdate.bind(this));
  }

  ngOnDestroy() {
    this._foodSubscription?.unsubscribe();
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

    // TODO: implement error snacks
  }

  private _foodSubscription: Nullable<Subscription> = null;
}
