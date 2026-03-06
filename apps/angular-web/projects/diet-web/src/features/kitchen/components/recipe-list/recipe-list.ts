import { CidNutrientsBar } from '@/shared/components/nutrients-bar/nutrients-bar';
import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'cid-recipe-list',
  imports: [ReactiveFormsModule, CidNutrientsBar],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidRecipeList {
  control = new FormControl(0);

  @HostBinding('class')
  hostClass = 'cid-recipe-list';
}
