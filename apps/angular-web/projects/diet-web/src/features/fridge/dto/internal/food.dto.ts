import * as z from 'zod/v4-mini';

export const name = z.string().check(
  z.maxLength(255, { message: "Name shouldn't be longer than 255 symbols" }),
  z.minLength(1, { message: 'Name is required' }),
);

export const counter = z.optional(z.string().check(z.emoji()));

export const description = z.optional(z.string());

export const perishable = z.optional(z.boolean());

export const favorite = z.optional(z.boolean());

export const foodCreateSchema = z.object({
  name,
  counter,
  description,
  favorite,
});
export type FoodCreateDto = z.infer<typeof foodCreateSchema>;
