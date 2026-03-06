import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { FridgeService } from '../fridge.service';

export const resetFoodOnLeave: CanDeactivateFn<unknown> = () => {
  inject(FridgeService).reset();

  return true;
};
