import { PrismaClient } from '../../dist/index.js';

import { EnvSchema } from './env.dto.js';

const client = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

async function main() {
  const envDto = EnvSchema.safeParse(process.env);
  if (!envDto.success) {
    throw envDto.error;
  }

  // more seeding here in the future
}

main()
  .then(async () => {
    await client.$disconnect();
  })
  .catch(async error => {
    console.error(error);
    await client.$disconnect();
    process.exit(1);
  });
