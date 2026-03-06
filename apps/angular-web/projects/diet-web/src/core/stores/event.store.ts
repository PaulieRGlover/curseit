import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
  CookPortions,
  DiscardPortionsFromCooking,
  PortionsAssignedForCooking,
  PortionsDiscardedFromCooking,
} from '../events';

export type EventMap = {
  'fridge/cookPortions': CookPortions;
  'fridge/discardPortionsFromCooking': DiscardPortionsFromCooking;
  'kitchen/portionsAssignedForCooking': PortionsAssignedForCooking;
  'kitchen/portionsDiscardedFromCooking': PortionsDiscardedFromCooking;
};

@Injectable({ providedIn: 'root' })
export class EventStore {
  private readonly _subjects = new Map<keyof EventMap, Subject<any>>();

  on<K extends keyof EventMap>(type: K): Observable<EventMap[K]> {
    return this._getSubject(type).asObservable();
  }

  emit<K extends keyof EventMap>(
    ...args: void extends EventMap[K] ? [type: K] : [type: K, payload: EventMap[K]]
  ): void {
    const [type, payload] = args;
    this._getSubject(type).next(payload as EventMap[K]);
  }

  private _getSubject<K extends keyof EventMap>(type: K): Subject<EventMap[K]> {
    let subject = this._subjects.get(type);

    if (!subject) {
      subject = new Subject<EventMap[K]>();
      this._subjects.set(type, subject);
    }

    return subject as Subject<EventMap[K]>;
  }
}
