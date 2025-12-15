import { Routes } from '@angular/router';

import { ROUTES } from '@/core/router/routes';

import { CidRecipeList } from './components/recipe-list/recipe-list';

export const kitchenRoutes: Routes = [
  { path: '', redirectTo: ROUTES.KITCHEN.RECIPES.ROOT.declare(), pathMatch: 'full' },
  {
    path: ROUTES.KITCHEN.RECIPES.ROOT.declare(),
    component: CidRecipeList,
    data: { id: ROUTES.KITCHEN.RECIPES.ROOT.id },
  },
];
