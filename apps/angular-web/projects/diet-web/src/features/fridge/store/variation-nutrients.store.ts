import { Injectable, computed, signal } from '@angular/core';

import { Failure } from '@curseit/resource';
import { Nullable } from '@curseit/types';
import { calculateAtwaterKcal } from '@curseit/units';

import {
  addStoreCollectionItems,
  getStoreCollectionItemById,
  removeStoreCollectionItemById,
  updateStoreCollectionItemById,
} from '@/core/utils/store';
import {
  ALCOHOL_NAME,
  CARBOHYDRATES_NAME,
  FATS_NAME,
  PROTEIN_NAME,
} from '@/shared/constants/nutrients.constants';

import { VariationNutrient } from '../types/external/variation.types';
import { VariationNutrientUpdate } from '../types/internal/variation.types';

@Injectable({ providedIn: 'root' })
export class VariationNutrientsStore {
  variationNutrients = signal<Nullable<Array<VariationNutrient>>>(null);
  loading = signal<Array<VariationNutrient['id']> | boolean>(false);
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

  getById(id: VariationNutrient['id']) {
    return getStoreCollectionItemById(this.variationNutrients, id);
  }

  isVariationNutrientLoading(id: VariationNutrient['id']) {
    const loading_ = this.loading();
    return typeof loading_ === 'boolean' ? loading_ : loading_?.includes(id);
  }

  addToLoading(id: VariationNutrient['id']) {
    this.loading.update(loading => [...(Array.isArray(loading) ? loading : []), id]);
  }

  removeFromLoading(variationNutrientId: VariationNutrient['id']) {
    this.loading.update(loading => {
      return Array.isArray(loading) ? loading.filter(id => id !== variationNutrientId) : loading;
    });
  }

  compare(id: VariationNutrient['id'], update: VariationNutrientUpdate) {
    const nutrient = getStoreCollectionItemById(this.variationNutrients, id);
    if (!nutrient) {
      throw new Error('nothing to compare');
    }

    return (Object.keys(update) as Array<keyof typeof update>).every(key => {
      return nutrient[key] === update[key];
    });
  }

  add(nutrient: VariationNutrient) {
    addStoreCollectionItems(this.variationNutrients, [nutrient]);
  }

  update(id: string, update: Partial<VariationNutrient>) {
    updateStoreCollectionItemById(this.variationNutrients, id, update);
  }

  remove(id: VariationNutrient['id']) {
    removeStoreCollectionItemById(this.variationNutrients, id);
  }

  reset() {
    this.variationNutrients.set(null);
    this.loading.set(false);
    this.failure.set(null);
  }
}
