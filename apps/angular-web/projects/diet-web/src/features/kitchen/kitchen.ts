import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cid-kitchen',
  templateUrl: './kitchen.html',
  styleUrl: './kitchen.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
})
export class CidKitchen {
  @HostBinding('class')
  hostClass = 'cid-kitchen';
}
