import { PromiseExecutor } from '@nx/devkit';

import * as path from 'path';
import { $ } from 'execa';

import { BootstrapPrismaExecutorSchema } from './schema';
import { waitUntilOnline } from './wait-until-online';
import { EnvSchema } from './env.dto';
import { existsSync } from 'fs';
import { prismaNeedsSetup } from './prisma-needs-setup';

const runExecutor: PromiseExecutor<BootstrapPrismaExecutorSchema> = async (options, context) => {
  const projectName = context.projectName;
  if (!projectName) {
    console.log('❌ No project name found. Aborting executor.');
    return { success: false };
  }

  const env = context.configurationName;
  const pathToLib = context.projectGraph.nodes[projectName].data.root;
  const pathToDockerCompose = path.join(pathToLib, `docker-compose.${env}.yml`);
  const pathToSchema = path.join(pathToLib, `src/schema.prisma`);

  const envDto = EnvSchema.safeParse(process.env);
  if (!envDto.success) {
    console.error('🔒 Environment validation failed:', envDto.error);
    throw envDto.error;
  }

  const dbNameNoSchema = envDto.data.databaseUrl.replace(/\?schema=.*$/, '');

  if (options.reset) {
    console.log('\n🗑️  Reset mode: tearing down existing Docker containers and volumes...');
    await $({ env: process.env, stdio: 'inherit' })`
      docker compose -f ${pathToDockerCompose} down -v
    `;
    console.log('⚙️  Teardown complete: containers and volumes removed.\n');
  }

  console.log('\n🚀 Starting database container...');
  await $({ env: process.env, stdio: 'inherit' })`
    docker compose -f ${pathToDockerCompose} up db -d
  `;
  console.log('✅ Database container started.\n');

  console.log('\n⏳ Waiting for database to accept connections...');
  await waitUntilOnline(envDto.data.databaseUrl);
  console.log('✅ Database is online and ready.\n');

  if (options.reset || await prismaNeedsSetup(pathToSchema)) {
    console.log('\n🔄 Reset mode: resetting database migrations...');
    await $({ env: process.env, stdio: 'inherit' })`
      npx prisma migrate reset --force --skip-seed --schema=${pathToSchema}
    `;
    console.log('✨ Migrations reset complete.\n');
  }

  if (options.seed) {
    console.log('\n🌱 Seeding data...');
    const pathToSeed = path.join(pathToLib, `src/seed/index.ts`);
    const pathToDump = path.join(pathToLib, `src/seed/seed.dump`);
    const hasDump = existsSync(pathToDump);

    if (hasDump) {
      console.log(`\n🚀 \`seed.dump\` file found: spinning up 4 workers to load the dump…`);
      await $({ stdio: 'inherit' })`
        pg_restore --jobs=4 --no-owner --no-privileges --dbname=${dbNameNoSchema} ${pathToDump}
      `;
      console.log(`✅ Parallel restore complete: all data loaded successfully!\n`);
    }

    console.log('\n🔎 Running TypeScript seed script...');
    await $({ env: process.env, stdio: 'inherit' })`npx tsx ${pathToSeed}`;
    console.log('✅ TypeScript seed script complete.\n');
  }

  console.log('🎉 Bootstrap executor finished successfully.\n');
  return { success: true };
};

export default runExecutor;
