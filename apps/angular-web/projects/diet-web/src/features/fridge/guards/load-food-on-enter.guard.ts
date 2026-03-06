import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';

import { FridgeService } from '../fridge.service';

export const loadFoodOnEnter: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const foodId = route.params?.['foodId'];
  if (!foodId) {
    return false;
  }

  inject(FridgeService).loadFood(foodId);

  return true;
};
