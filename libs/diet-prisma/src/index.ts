import * as path from 'path';
import {
  PrismaClient,
  Prisma as DietPrisma,
} from '../generated/index.js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

export const DietPrismaClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export {
  DietPrisma,
};

export * from '../generated/index.js';
