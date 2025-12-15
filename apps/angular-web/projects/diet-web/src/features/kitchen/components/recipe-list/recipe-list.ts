import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cid-recipe-list',
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidRecipeList {
  @HostBinding('class')
  hostClass = 'cid-recipe-list';
}
