import { Injectable, signal } from '@angular/core';

import { Failure } from '@curseit/resource';
import { Nullable } from '@curseit/types';

import { RecipeProject } from '../types/external/recipe-project.types';

@Injectable({ providedIn: 'root' })
export class RecipeProjectStore {
  recipeProject = signal<Nullable<RecipeProject>>(null);
  loading = signal(false);
  failure = signal<Nullable<Failure>>(null);

  update(update: RecipeProject) {
    this.recipeProject.update(recipeProject => {
      return recipeProject ? { ...recipeProject, ...update } : null;
    });
  }
}
