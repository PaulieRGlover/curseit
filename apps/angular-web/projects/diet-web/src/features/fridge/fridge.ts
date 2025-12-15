import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cid-fridge',
  imports: [RouterOutlet],
  templateUrl: './fridge.html',
  styleUrl: './fridge.scss',
})
export class CidFridge {
  @HostBinding('class')
  hostClass = 'cid-fridge';
}
