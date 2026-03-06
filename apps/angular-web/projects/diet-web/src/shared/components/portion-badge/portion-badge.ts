import {
  Component,
  HostBinding,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';

import * as z from 'zod/v4-mini';

import { CiuiButton, Size } from '@curseit/ciui';
import { Nullable } from '@curseit/types';

const DEFAULT_COUNTER = '🥫';

export type Freshness = 'fresh' | 'still-good' | 'almost-spoiled' | 'spoiled' | 'irrelevant';

@Component({
  selector: 'cid-portion-badge',
  imports: [CiuiButton],
  templateUrl: './portion-badge.html',
  styleUrl: './portion-badge.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidPortionBadge {
  freshnessSource = input<Nullable<number>, Nullable<number>>(1, {
    alias: 'freshness',
    transform: (value: Nullable<number>) => {
      return value === null ? value : Math.max(0, Math.min(1, value))
    },
  });
  remaining = input<number, number>(1, {
    transform: (value: number) => Math.max(0, Math.min(1, value)),
  });
  size = input<Size>('medium');
  counter = input<string, any>(DEFAULT_COUNTER, {
    transform: (value: string) => z.emoji().safeParse(value).data ?? DEFAULT_COUNTER,
  });
  removable = input<boolean, any>(false, { transform: booleanAttribute });
  isRemoving = input<boolean, any>(false, { transform: booleanAttribute });

  remove = output();

  meterStyle = computed(() => {
    return { height: `${Math.max(this.remaining() * 100, 20)}%` };
  });
  freshness = computed<Freshness>(() => {
    const freshnessSource_ = this.freshnessSource();
    if (freshnessSource_ === null) {
      return 'irrelevant';
    } else if (freshnessSource_ > 0.66) {
      return 'fresh';
    } else if (freshnessSource_ > 0.33 && freshnessSource_ <= 0.66) {
      return 'still-good';
    } else if (freshnessSource_ > 0 && freshnessSource_ <= 0.33) {
      return 'almost-spoiled';
    }

    return 'spoiled';
  });

  @HostBinding('attr.title')
  get title() {
    switch (this.freshness()) {
      case 'fresh':
        return "It's fresh!";
      case 'still-good':
        return "It's not so fresh";
      case 'almost-spoiled':
        return 'You can still eat this... Probably';
      case 'spoiled':
        return "It's spoiled!";
      case 'irrelevant':
        return "Either you didn't set the expiration date, or it's non-perishable";
    }
  }

  @HostBinding('class')
  get hostClasses() {
    return [
      'cid-portion-badge',
      `cid-portion-badge--freshness-${this.freshness()}`,
      `cid-portion-badge--size-${this.size()}`,
    ];
  }
}
