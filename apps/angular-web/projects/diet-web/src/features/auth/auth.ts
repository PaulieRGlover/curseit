import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CiuiCard } from '@curseit/ciui';

@Component({
  selector: 'cid-auth',
  imports: [RouterOutlet, CiuiCard],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidAuth {
  @HostBinding('class')
  hostClass = 'cid-auth';
}
