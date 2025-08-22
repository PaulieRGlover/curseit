import { Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { CiuiLoader, CiuiSelect } from '@curseit/ciui';

import { FridgeService } from '../../fridge.service';
import { VariationsStore } from '../../store/variations.store';
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

  variation = new FormControl(this.variationsStore.variations()?.[0]);

  ngOnInit() {
    this.handleVariationChange();
  }

  handleVariationChange() {
    const variationId = this.variation.value?.id;
    if (!variationId) {
      return;
    }

    this.fridgeService.loadVariation(variationId);
  }
}
