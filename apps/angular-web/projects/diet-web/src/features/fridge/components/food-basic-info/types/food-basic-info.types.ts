import { food } from '@/features/fridge/types/external/food.types';
import * as z from 'zod/v4-mini';

export const foodBasicInfoModel = z.pick(food, { name: true, description: true, perishable: true });
export type FoodBasicInfoModel = z.infer<typeof foodBasicInfoModel>;
