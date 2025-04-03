import { registerAs } from '@nestjs/config';

export const foodsPrismaConfig = registerAs('database', () => ({
  db: process.env.DATABASE_URL
}));
