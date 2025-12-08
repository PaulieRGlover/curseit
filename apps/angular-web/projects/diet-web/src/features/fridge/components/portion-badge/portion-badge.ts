import { Component, HostBinding, ViewEncapsulation, computed, input } from '@angular/core';

import * as z from 'zod/v4-mini';

import { Size } from '@curseit/ciui';

import { Portion } from '../../types/external/portion.types';
import { PortionFreshness } from '../../types/internal/portion.types';

const DEFAULT_COUNTER = '🥫';

@Component({
  selector: 'cid-portion-badge',
  templateUrl: './portion-badge.html',
  styleUrl: './portion-badge.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidPortionBadge {
  freshnessSource = input<Portion['freshness']>(1, { alias: 'freshness' });
  remaining = input<number, number>(100, {
    transform: (value: number) => Math.max(0, Math.min(100, value)),
  });
  size = input<Size>('medium');
  counter = input<string, any>(DEFAULT_COUNTER, {
    transform: (value: string) => z.emoji().safeParse(value).data ?? DEFAULT_COUNTER,
  });

  meterStyle = computed(() => {
    return { height: `${Math.max(this.remaining(), 20)}%` };
  });
  freshness = computed<PortionFreshness>(() => {
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
  title = computed(() => {
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
  });

  @HostBinding('class')
  get hostClasses() {
    return [
      'cid-portion-badge',
      `cid-portion-badge--freshness-${this.freshness()}`,
      `cid-portion-badge--size-${this.size()}`,
    ];
  }
}
