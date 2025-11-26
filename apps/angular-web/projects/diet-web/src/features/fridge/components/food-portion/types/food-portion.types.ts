import { Nullable } from '@curseit/types';

import { VariationAbridged } from '@/features/fridge/types/external/variation.types';
import { Counter, PortionSize } from '@/features/fridge/types/internal/variation.types';

export type PortionInput = {
  variation: VariationAbridged;
  counter: Counter;
  dateAdded: Date;
  dateExpiring: Nullable<Date>;
  portionSize: PortionSize;
};
