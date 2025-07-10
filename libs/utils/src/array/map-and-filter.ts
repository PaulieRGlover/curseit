import { isNotNullish } from '../typeguards/is-defined.js';

import type { Nullable, MaybeUndefined } from '@curseit/types';

export const mapAndFilter = <Item, Result>(
  array: Array<Item>,
  callback: (item: Item) => MaybeUndefined<Nullable<Result>>,
): Array<Result> => {
  return array.map(callback).filter((item): item is Result => isNotNullish<Result>(item));
};
