import { Routes } from '@angular/router';

import { ROUTES } from '@/core/router/routes';

import { CidFoodInfo } from './food-info/food-info';
import { CidFoodList } from './food-list/food-list';
import { CidFoodPortions } from './food-portions/food-portions';
import { CidFood } from './food/food';

export const fridgeRoutes: Routes = [
  { path: '', redirectTo: ROUTES.FRIDGE.FOODS.ROOT.declare(), pathMatch: 'full' },
  {
    path: ROUTES.FRIDGE.FOODS.ROOT.declare(),
    component: CidFoodList,
    data: { id: ROUTES.FRIDGE.FOODS.ROOT.id },
    children: [
      {
        path: ROUTES.FRIDGE.FOODS.FOOD.ROOT.declare(),
        component: CidFood,
        data: { id: ROUTES.FRIDGE.FOODS.FOOD.ROOT.id },
        children: [
          {
            path: ROUTES.FRIDGE.FOODS.FOOD.INFO.declare(),
            component: CidFoodInfo,
            data: { id: ROUTES.FRIDGE.FOODS.FOOD.INFO.id },
            pathMatch: 'full',
          },
          {
            path: ROUTES.FRIDGE.FOODS.FOOD.PORTIONS.declare(),
            component: CidFoodPortions,
            data: { id: ROUTES.FRIDGE.FOODS.FOOD.PORTIONS.id },
          },
        ],
      },
    ],
  },
];
