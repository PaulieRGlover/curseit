import { Component, computed, HostBinding, input, ViewEncapsulation } from '@angular/core';
import { Size } from '@curseit/ciui';
import * as z from 'zod/v4-mini';

export type Freshness = 'fresh' | 'still-good' | 'almost-spoiled' | 'spoiled' | 'irrelevant';

const DEFAULT_COUNTER = '🥫';

@Component({
  selector: 'cid-portion',
  templateUrl: './portion.html',
  styleUrl: './portion.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidPortion {
  freshness = input<Freshness>('fresh');
  remaining = input<number, number>(100, {
    transform: (value: number) => Math.max(0, Math.min(100, value)),
  });
  size = input<Size>('medium');
  indicator = input<string, string>(DEFAULT_COUNTER, {
    transform: (value: string) => z.emoji().safeParse(value).data ?? DEFAULT_COUNTER,
  });

  meterStyle = computed(() => {
    return { height: `${this.remaining()}%` };
  });

  @HostBinding('class')
  get hostClasses() {
    return [
      'cid-portion',
      `cid-portion--freshness-${this.freshness()}`,
      `cid-portion--size-${this.size()}`,
    ];
  }
}
