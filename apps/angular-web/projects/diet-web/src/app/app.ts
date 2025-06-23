import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

import { Observable, map } from 'rxjs';

import { AuthService } from '@/features/auth/auth.service';

import { ProfileDropdown } from '../features';

import { Guest, Home } from './layouts';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Guest, Home, ProfileDropdown, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  get layout$(): Observable<string | undefined> | undefined {
    return this.route.firstChild?.data.pipe(map(data => data['layout']));
  }

  ngOnInit() {
    this.authService.initialize();
  }
}
