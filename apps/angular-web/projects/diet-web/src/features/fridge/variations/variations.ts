import { Component, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  CiuiLoader,
  CiuiSelect,
  SelectAddOptionPayload,
  SelectEditOptionPayload,
  SelectRemoveOptionPayload,
  SelectService,
} from '@curseit/ciui';

import { FridgeService } from '../fridge.service';
import { VariationsStore } from '../store/variations.store';
import { VariationAbridged } from '../types/external/food.types';
import { CidVariation } from '../variation/variation';

@Component({
  selector: 'cid-variations',
  imports: [ReactiveFormsModule, CiuiSelect, CidVariation, CiuiLoader],
  templateUrl: './variations.html',
  styleUrl: './variations.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cid-food-variations',
  },
})
export class CidVariations {
  fridgeService = inject(FridgeService);
  variationsStore = inject(VariationsStore);
  selectService = inject(SelectService);

  variation = new FormControl(this.variationsStore.variations()?.[0]);

  ngOnInit() {
    this.handleVariationChange();
  }

  handleVariationChange() {
    const variationId = this.variation.value?.id;
    if (!variationId) {
      return;
    }

    this.fridgeService.getVariation(variationId);
  }

  async handleVariationAdd(payload: SelectAddOptionPayload<VariationAbridged>) {
    const { add, finished$ } = payload;

    const newVariation = await this.fridgeService.createVariation({ name: add });

    finished$.next(newVariation);
  }

  async handleVariationRemove(payload: SelectRemoveOptionPayload<VariationAbridged>) {
    const { option, finished$ } = payload;

    await this.fridgeService.deleteVariation(option.id);

    finished$.next();
  }

  async handleVariationEdit(payload: SelectEditOptionPayload<VariationAbridged>) {
    const { option, edit, finished$ } = payload;

    const updatedVariation = await this.fridgeService.updateVariation({ name: edit }, option.id);

    finished$.next(updatedVariation);
  }
}
