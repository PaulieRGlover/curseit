import * as z from 'zod/v4-mini';

import { portion } from '../external/portion.types';

export const portionCreate = z.pick(portion, { variationId: true });
export type PortionCreate = z.infer<typeof portionCreate>;

export const portionUpdate = z.omit(z.partial(portion), { id: true, counter: true });
export type PortionUpdate = z.infer<typeof portionUpdate>;
