import {
  Component,
  HostBinding,
  ViewEncapsulation,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CiuiButton, CiuiCheckbox, CiuiContextMenu, CiuiSelect, CiuiSliderInput } from '@curseit/ciui';

import { CidPortionBadge } from '@/shared/components/portion-badge/portion-badge';

import { KitchenService } from '../../kitchen.service';
import { RecipeProjectIngredientsStore } from '../../store/recipe-project-ingredients.store';
import { RecipeProjectStore } from '../../store/recipe-project.store';
import { Ingredient } from '../../types/external/recipe-project-ingredient.types';
import { RecipeProjectValidationService } from '../../validation/internal/recipe-project-validation.service';

@Component({
  selector: 'cid-recipe-project-minimized',
  imports: [
    ReactiveFormsModule,
    CiuiCheckbox,
    CiuiSelect,
    CiuiSliderInput,
    CiuiContextMenu,
    CiuiButton,
    CidPortionBadge,
  ],
  templateUrl: './recipe-project-minimized.html',
  styleUrl: './recipe-project-minimized.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidRecipeProjectMinimized {
  kitchenService = inject(KitchenService);
  recipeProjectStore = inject(RecipeProjectStore);
  recipeProjectIngredientsStore = inject(RecipeProjectIngredientsStore);
  recipeProjectValidationService = inject(RecipeProjectValidationService);

  recipeProjectForm = new FormGroup({
    spendPortions: new FormControl(true),
  });

  recipe = new FormControl('New Recipe');
  recipeOptions = ['New Recipe'];

  constructor() {
    effect(() => {
      const recipeProject_ = this.recipeProjectStore.recipeProject();

      untracked(() => {
        if (recipeProject_) {
          this.recipeProjectForm.controls.spendPortions.setValue(recipeProject_.spendPortions);
        }
      });
    });
  }

  handleIngredientRemove(ingredient: Ingredient) {
    this.kitchenService.removeIngredients([ingredient]);
  }

  async handleChange() {
    const recipeProjectUpdate = await this.recipeProjectValidationService.recipeProjectUpdate(
      this.recipeProjectForm.value,
    );
    if (!recipeProjectUpdate) {
      return;
    }

    this.kitchenService.updateRecipeProject(recipeProjectUpdate);
  }

  async cancelRecipeProject() {
    this.kitchenService.removeRecipeProject();
  }

  @HostBinding('class')
  hostClass = 'cid-recipe-project-minimized';
}
