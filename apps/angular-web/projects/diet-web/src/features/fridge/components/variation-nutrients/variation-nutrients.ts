import {
  Component,
  HostBinding,
  ViewEncapsulation,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { v4 as uuidv4 } from 'uuid';

import { FridgeService } from '../../fridge.service';
import { VariationNutrientsStore } from '../../store/variation-nutrients.store';
import { VariationNutrient } from '../../types/external/food.types';
import { CidVariationNutrient } from '../variation-nutrient/variation-nutrient';

import { variationNutrientToVariationNutrientListItem } from './transformers/variation-nutrient-to-variation-nutrient-list-item.transformer';
import {
  VariationNutrientListItem,
  VariationNutrientListItemUpdate,
} from './types/variation-nutrient-list-item.types';

@Component({
  selector: 'cid-variation-nutrients',
  imports: [ReactiveFormsModule, CidVariationNutrient],
  templateUrl: './variation-nutrients.html',
  styleUrl: './variation-nutrients.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidVariationNutrients {
  fridgeService = inject(FridgeService);
  variationNutrientsStore = inject(VariationNutrientsStore);

  variationNutrients = signal<Array<VariationNutrientListItem>>([this._getEmptyNutrient()]);

  constructor() {
    effect(() => {
      const variationNutrients = this.variationNutrientsStore.variationNutrients();

      untracked(() => {
        if (!variationNutrients) {
          return;
        }

        const presentIds = new Set(variationNutrients.map(({ id }) => id));
        this.variationNutrients.update(variationNutrients =>
          variationNutrients.filter(({ id }) => !id || presentIds.has(id)),
        );
      });
    });
  }

  ngOnInit() {
    const variationNutrients = this.variationNutrientsStore.variationNutrients();
    if (variationNutrients?.length) {
      this.variationNutrients.set([
        ...variationNutrients.map(variationNutrientToVariationNutrientListItem),
        this._getEmptyNutrient(),
      ]);
    }
  }

  async handleVariationNutrientUpdate(
    update: VariationNutrientListItemUpdate,
    internalId: VariationNutrientListItem['internalId'],
    id: VariationNutrientListItem['id'],
    isEmpty: VariationNutrientListItem['isEmpty'],
  ) {
    if (isEmpty) {
      this.createVariationNutrient(update, internalId);
    } else {
      if (!id) {
        throw new Error('no id for variation nutrient update operation');
      }

      this.updateVariationNutrient(update, id);
    }
  }

  async createVariationNutrient(update: VariationNutrientListItemUpdate, internalId: string) {
    const createdVariationNutrient = await this.fridgeService.createVariationNutrient(update);
    if (!createdVariationNutrient) {
      return;
    }

    this.variationNutrients.update(variationNutrients => {
      return [
        ...variationNutrients.map(variationNutrient => {
          if (variationNutrient.internalId !== internalId) {
            return variationNutrient;
          }

          return {
            ...variationNutrient,
            id: createdVariationNutrient!.id,
            isEmpty: false,
          };
        }),
        this._getEmptyNutrient(),
      ];
    });
  }

  async updateVariationNutrient(
    update: VariationNutrientListItemUpdate,
    id: VariationNutrient['id'],
  ) {
    const updatedVariationNutrient = await this.fridgeService.updateVariationNutrient({
      id,
      ...update,
    });
    if (!updatedVariationNutrient) {
      return;
    }

    this.variationNutrients.update(variationNutrients => {
      return variationNutrients.map(variationNutrient => {
        if (variationNutrient.id !== id) {
          return variationNutrient;
        }

        return {
          ...variationNutrient,
          ...updatedVariationNutrient,
        };
      });
    });
  }

  @HostBinding('class')
  hostClass = 'cid-variation-nutrients';

  private _getEmptyNutrient(): VariationNutrientListItem {
    return {
      internalId: `temp-${uuidv4()}`,
      name: '',
      valueInGrams: 0,
      valueDisplayUnit: 'g',
      nutrientId: null,
      isEmpty: true,
    };
  }
}
