import { ElementRef, Injectable, OutputEmitterRef, Signal } from '@angular/core';

import { Nullable } from '@curseit/types';

const DELETE_SEQUENCE_TIMEOUT = 500;

type AngryDeleteComponent = {
  activeElements: Signal<Array<ElementRef['nativeElement']>>;
  angryDelete: OutputEmitterRef<void>;
};

@Injectable({ providedIn: 'root' })
export class AngryDeleteService {
  constructor() {
    // it's `keyup` because we need three consecutive hits instead of long press
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        this.handleWindowDeletePress();
      }
    });
  }

  register(component: AngryDeleteComponent) {
    this._components.push(component);
  }

  unregister(component: AngryDeleteComponent) {
    const index = this._components.indexOf(component);
    if (index >= 0) {
      this._components.splice(index, 1);
    }
  }

  resetAngryDelete() {
    this._deletePressCount = 0;
  }

  handleWindowDeletePress() {
    const activeComponents = this._components.filter(({ activeElements }) => {
      return activeElements().some(element => element.contains(document.activeElement));
    });
    if (!activeComponents.length) {
      return;
    }

    this._deletePressCount++;
    if (this._deletePressCount >= 3) {
      activeComponents.forEach(({ angryDelete }) => angryDelete.emit());
      return;
    }

    if (this._deletePressTimeout) {
      clearTimeout(this._deletePressTimeout);
    }

    this._deletePressTimeout = setTimeout(() => {
      this._deletePressCount = 0;
      this._deletePressTimeout = null;
    }, DELETE_SEQUENCE_TIMEOUT);
  }

  private _components: Array<AngryDeleteComponent> = [];
  private _deletePressCount = 0;
  private _deletePressTimeout: Nullable<number> = null;
}
