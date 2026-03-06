import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { CidPortionBadge } from '@/shared/components/portion-badge/portion-badge';

import { RecipeProjectIngredientsStore } from '../../store/recipe-project-ingredients.store';
import { RecipeProjectStore } from '../../store/recipe-project.store';

@Component({
  selector: 'cid-recipe-project-minimized',
  imports: [ReactiveFormsModule, CidPortionBadge],
  templateUrl: './recipe-project-minimized.html',
  styleUrl: './recipe-project-minimized.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidRecipeProjectMinimized {
  recipeProjectStore = inject(RecipeProjectStore);
  recipeProjectIngredientsStore = inject(RecipeProjectIngredientsStore);

  @HostBinding('class')
  hostClass = 'cid-recipe-project-minimized';
}
