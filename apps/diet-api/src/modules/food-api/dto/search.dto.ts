import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const Search = z.object({
  name: z.string(),
});

export class SearchDto extends createZodDto(Search) {}

export const GetFood = z.object({
  id: z.string(),
});

export class GetFoodDto extends createZodDto(GetFood) {}
