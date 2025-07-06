import { $ } from 'execa';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

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

  const dbName = envDto.data.databaseUrl.replace(/\?schema=.*$/, '');
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const DUMP_FILE = join(__dirname, 'seed.dump');

  console.log(`🚀 Starting parallel restore: spinning up 4 workers to load the dump…`);
  await $({ stdio: 'inherit' })
    `pg_restore --jobs=4 --no-owner --no-privileges --dbname=${dbName} ${DUMP_FILE}`;
  console.log(`✅ Parallel restore complete: all data loaded successfully!`);
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
