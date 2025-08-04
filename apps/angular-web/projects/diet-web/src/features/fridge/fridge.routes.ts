import { Routes } from '@angular/router';

import { ROUTES } from '@/core/router/routes';

import { CidFood } from './food/food';
import { CidFoods } from './foods/foods';

export const fridgeRoutes: Routes = [
  { path: '', component: CidFoods },
  { path: ROUTES.FRIDGE.FOOD.declare(), component: CidFood },
];
