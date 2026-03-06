import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cid-recipe-project-expanded',
  templateUrl: './recipe-project-expanded.html',
  styleUrl: './recipe-project-expanded.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidRecipeProjectExpanded {
  @HostBinding('class')
  hostClass = 'cid-recipe-project-expanded';
}
