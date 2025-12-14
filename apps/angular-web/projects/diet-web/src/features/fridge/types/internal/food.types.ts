import * as z from 'zod/v4-mini';

export const name = z.optional(z.string().check(
  z.maxLength(255, { message: "Name shouldn't be longer than 255 symbols" }),
));

export const description = z.optional(z.string());

export const perishable = z.optional(z.boolean());

export const favorite = z.optional(z.boolean());

export const foodInput = z.object({
  name,
  description,
  perishable,
  favorite,
});
export type FoodInput = z.infer<typeof foodInput>;

export const foodCreate = foodInput;
export type FoodCreate = z.infer<typeof foodCreate>;

export const foodUpdate = foodInput;
export type FoodUpdate = z.infer<typeof foodUpdate>;
