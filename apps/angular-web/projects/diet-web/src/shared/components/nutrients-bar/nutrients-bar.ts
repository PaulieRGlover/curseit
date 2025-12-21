import { PercentPipe } from '@angular/common';
import {
  Component,
  HostBinding,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

import { CiuiContextMenu, CiuiContextMenuTrigger, Trigger } from '@curseit/ciui';

import { NutrientUnit } from '@/features/fridge/types/internal/variation.types';

type MacroNutrients = {
  protein?: number;
  carbs?: number;
  fats?: number;
  alcohol?: number;
};

@Component({
  selector: 'cid-nutrients-bar',
  imports: [PercentPipe, CiuiContextMenu, CiuiContextMenuTrigger],
  templateUrl: './nutrients-bar.html',
  styleUrl: './nutrients-bar.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidNutrientsBar {
  macroNutrients = input.required<MacroNutrients>();
  macroNutrientsUnit = input<NutrientUnit>('g');

  macroNutrientViews = computed(() => {
    const nutrients_ = this.macroNutrients();
    const unit_ = this.macroNutrientsUnit();
    const nutrientKeys = Object.keys(nutrients_) as Array<keyof MacroNutrients>;
    const combinedAmount = nutrientKeys.reduce((amount, nutrientKey) => {
      return (nutrients_[nutrientKey] ?? 0) + amount;
    }, 0);
    return nutrientKeys.reduce(
      (nutrientViews, nutrientKey) => {
        const amount = nutrients_[nutrientKey] ?? 0;

        if (amount) {
          nutrientViews.push({
            name: nutrientKey,
            amount: amount + unit_,
            proportion: amount / combinedAmount,
          });
        }
        return nutrientViews;
      },
      [] as Array<{ name: keyof MacroNutrients; amount: string; proportion: number }>,
    );
  });

  @HostBinding('class')
  hostClass = 'cid-nutrients-bar';
}
