import { Component, HostBinding, ViewEncapsulation, inject, signal } from '@angular/core';

import { KitchenService } from '../../kitchen.service';
import { RecipeProjectStore } from '../../store/recipe-project.store';
import { CidRecipeProjectExpanded } from '../recipe-project-expanded/recipe-project-expanded';
import { CidRecipeProjectMinimized } from '../recipe-project-minimized/recipe-project-minimized';

@Component({
  selector: 'cid-recipe-project',
  imports: [CidRecipeProjectExpanded, CidRecipeProjectMinimized],
  templateUrl: './recipe-project.html',
  encapsulation: ViewEncapsulation.None,
})
export class CidRecipeProject {
  kitchenService = inject(KitchenService);
  recipeProjectStore = inject(RecipeProjectStore);
  expanded = signal(false);

  ngOnInit() {
    if (!this.recipeProjectStore.recipeProject()) {
      this.kitchenService.loadRecipeProject();
    }
  }

  @HostBinding('class')
  hostClass = 'cid-recipe-project';
}
