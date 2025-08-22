import { Routes } from '@angular/router';

import { ROUTES } from '@/core/router/routes';

import { CidFoods } from './foods/foods';
import { CidFoodFull } from './food-full/food-full';

export const fridgeRoutes: Routes = [
  { path: '', redirectTo: ROUTES.FRIDGE.FOODS.ROOT.declare(), pathMatch: 'full' },
  {
    path: ROUTES.FRIDGE.FOODS.ROOT.declare(),
    component: CidFoods,
    children: [{ path: ROUTES.FRIDGE.FOODS.FOOD.declare(), component: CidFoodFull }],
  },
];
