import { Routes } from '@angular/router';

import { ROUTES } from '@/core/router/routes';

import { CidFoodInfo } from './components/food-info/food-info';
import { CidFoodList } from './components/food-list/food-list';
import { CidFood } from './components/food/food';
import { CidPortions } from './components/portions/portions';
import { loadFoodOnEnter } from './guards/load-food-on-enter.guard';
import { loadFoodPortionsOnEnter } from './guards/load-food-portions-on-enter.guard';
import { resetFoodOnLeave } from './guards/reset-food-on-leave.guard';

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
        canActivate: [loadFoodOnEnter],
        canDeactivate: [resetFoodOnLeave],
        children: [
          {
            path: ROUTES.FRIDGE.FOODS.FOOD.INFO.declare(),
            component: CidFoodInfo,
            data: { id: ROUTES.FRIDGE.FOODS.FOOD.INFO.id },
            pathMatch: 'full',
          },
          {
            path: ROUTES.FRIDGE.FOODS.FOOD.PORTIONS.declare(),
            component: CidPortions,
            data: { id: ROUTES.FRIDGE.FOODS.FOOD.PORTIONS.id },
            canActivate: [loadFoodPortionsOnEnter],
          },
        ],
      },
    ],
  },
];
