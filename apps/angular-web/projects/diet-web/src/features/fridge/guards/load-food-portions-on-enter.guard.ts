import { RouterService } from '@/core/router/router.service';
import { ROUTES } from '@/core/router/routes';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FridgeService } from '../fridge.service';

export const loadFoodPortionsOnEnter: CanActivateFn = () => {
  const routeId = ROUTES.FRIDGE.FOODS.FOOD.ROOT.id;
  const foodId = inject(RouterService).findInTreeById(routeId)?.params?.['foodId'];
  if (!foodId) {
    return false;
  }

  inject(FridgeService).loadPortions(foodId);

  return true;
};
