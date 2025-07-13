import { Routes } from '@angular/router';

import { ROUTES } from '@/core/router/routes';

import { Food } from './food/food';
import { Foods } from './foods/foods';

export const fridgeRoutes: Routes = [
  { path: '', component: Foods },
  { path: ROUTES.FRIDGE.FOOD.declare(), component: Food },
];
