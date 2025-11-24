import { Injectable, computed, signal } from '@angular/core';

import { Nullable } from '@curseit/types';
import { calculateAtwaterKcal } from '@curseit/units';

import {
  ALCOHOL_NAME,
  CARBOHYDRATES_NAME,
  FATS_NAME,
  PROTEIN_NAME,
} from '@/core/constants/nutrients.constants';
import { Failure } from '@/core/types/external/failure.types';

import { VariationNutrient } from '../types/external/variation.types';

@Injectable({ providedIn: 'root' })
export class VariationNutrientsStore {
  variationNutrients = signal<Nullable<Array<VariationNutrient>>>(null);
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);

  energyCalculatedKcal = computed(() => {
    const nutrients = this.variationNutrients();
    if (!nutrients) {
      return 0;
    }

    const protein = nutrients.find(({ name }) => name === PROTEIN_NAME);
    const carbohydrates = nutrients.find(({ name }) => name === CARBOHYDRATES_NAME);
    const fats = nutrients.find(({ name }) => name === FATS_NAME);
    const alcohol = nutrients.find(({ name }) => name === ALCOHOL_NAME);

    return calculateAtwaterKcal({
      protein: protein?.valueInGrams,
      carbohydrates: carbohydrates?.valueInGrams,
      fats: fats?.valueInGrams,
      alcohol: alcohol?.valueInGrams,
    });
  });

  compare(id: VariationNutrient['id'], update: VariationNutrient) {
    const nutrient = this.variationNutrients()?.find(nutrient => nutrient.id === id);
    if (!nutrient) {
      throw new Error('nothing to compare');
    }

    return (Object.keys(update) as Array<keyof typeof update>).every(key => {
      return nutrient[key] === update[key];
    });
  }

  add(nutrient: VariationNutrient) {
    this.variationNutrients.set([...(this.variationNutrients() ?? []), nutrient]);
  }

  update(id: string, update: VariationNutrient) {
    this.variationNutrients.update(
      nutrients =>
        nutrients?.map(nutrient =>
          nutrient.id === id ? { ...nutrient, ...update, isEmpty: false } : nutrient,
        ) ?? null,
    );
  }

  delete(id: VariationNutrient['id']) {
    this.variationNutrients.set(
      this.variationNutrients()?.filter(nutrient => nutrient.id !== id) ?? null,
    );
  }
}
