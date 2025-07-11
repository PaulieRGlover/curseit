import { Routes } from '@angular/router';

import { RouterService } from '@/core/router/router.service';

import { Food } from './food/food';
import { Foods } from './foods/food';

export const fridgeRoutes: Routes = [
  { path: '', component: Foods },
  { path: RouterService.ROUTES.FRIDGE.FOOD.declare(), component: Food },
];
