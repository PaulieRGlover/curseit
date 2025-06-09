import { Component } from '@angular/core';
import { ProfileDropdown } from '../features';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Guest, Home } from './layouts';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    Guest,
    Home,
    ProfileDropdown,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(private route: ActivatedRoute) {}

  get layout$(): Observable<string | undefined> | undefined {
    return this.route.firstChild?.data.pipe(
      map(data => data['layout']),
    );
  }
}
