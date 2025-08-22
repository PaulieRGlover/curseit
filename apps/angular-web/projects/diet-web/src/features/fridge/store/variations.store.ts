import { Injectable, signal } from '@angular/core';

import { Nullable } from '@curseit/types';

import { VariationsAbridged } from '../dto/external/food.dto';

@Injectable({ providedIn: 'root' })
export class VariationsStore {
  variations = signal<Nullable<VariationsAbridged>>(null);
}
