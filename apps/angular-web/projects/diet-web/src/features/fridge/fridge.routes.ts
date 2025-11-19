import { Routes } from '@angular/router';

import { ROUTES } from '@/core/router/routes';

import { CidFoodPortions } from './food-portions/food-portions';
import { CidFoodList } from './food-list/food-list';
import { CidFoodInfo } from './food-info/food-info';

export const fridgeRoutes: Routes = [
  { path: '', redirectTo: ROUTES.FRIDGE.FOODS.ROOT.declare(), pathMatch: 'full' },
  {
    path: ROUTES.FRIDGE.FOODS.ROOT.declare(),
    component: CidFoodList,
    children: [
      { path: ROUTES.FRIDGE.FOODS.FOOD.ROOT.declare(), component: CidFoodInfo },
      { path: ROUTES.FRIDGE.FOODS.FOOD.PORTIONS.declare(), component: CidFoodPortions },
    ],
  },
];
