import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { CiuiSelect } from '@curseit/ciui';
import { CidVariation } from '../variation/variation';

@Component({
  selector: 'cid-variations',
  imports: [ReactiveFormsModule, CiuiSelect, CidVariation],
  templateUrl: './variations.html',
  styleUrl: './variations.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'cid-food-variations',
  },
})
export class CidVariations {
  options = [
    { id: 'this', label: 'This' },
    { id: 'that', label: 'That' },
    { id: 'and this', label: 'And this is very very very long, but what can you do?' },
  ];

  variation = new FormControl(this.options[0]);
}
