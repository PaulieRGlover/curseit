import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CiuiCard } from '@curseit/ciui';

@Component({
  selector: 'cid-auth',
  imports: [RouterOutlet, CiuiCard],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class CidAuth {}
