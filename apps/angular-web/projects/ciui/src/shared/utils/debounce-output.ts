import { OutputEmitterRef } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';

import { debounceTime } from 'rxjs';

export const debounceOutput = <T>(output: OutputEmitterRef<T>, debounce = 500) => {
  const $ = outputToObservable(output);
  return $.pipe(debounceTime(debounce));
};
