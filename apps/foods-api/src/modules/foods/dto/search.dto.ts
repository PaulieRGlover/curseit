import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const Search = z.object({
  name: z.string(),
});

export class SearchDto extends createZodDto(Search) {}
