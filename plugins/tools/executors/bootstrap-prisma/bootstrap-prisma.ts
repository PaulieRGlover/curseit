import { PromiseExecutor } from '@nx/devkit';

import * as path from 'path';
import { $ } from 'execa';

import { BootstrapPrismaExecutorSchema } from './schema';
import { waitUntilOnline } from './wait-until-online';
import { EnvSchema } from './env.dto';

const runExecutor: PromiseExecutor<BootstrapPrismaExecutorSchema> = async (options, context) => {
  const projectName = context.projectName;
  if (!projectName) {
    return { success: false };
  }

  const env = context.configurationName;
  const pathToLib = context.projectGraph.nodes[projectName].data.root;
  const pathToDockerCompose = path.join(pathToLib, `docker-compose.${env}.yml`);
  const pathToSchema = path.join(pathToLib, `src/schema.prisma`);

  const envDto = EnvSchema.safeParse(process.env);
  if (!envDto.success) {
    throw envDto.error;
  }

  if (options.reset) {
    await $({ env: process.env, stdio: 'inherit' })
      `docker compose -f ${pathToDockerCompose} down -v`;
  }

  await $({ env: process.env, stdio: 'inherit' })
    `docker compose -f ${pathToDockerCompose} up db -d`;
    
  await waitUntilOnline(envDto.data.databaseUrl);

  await $({ env: process.env, stdio: 'inherit' })
    `npx prisma migrate reset --force --skip-seed --schema=${pathToSchema}`;

  if (options.seed) {
    const pathToSeed = path.join(pathToLib, `src/seed/index.ts`);

    await $({ env: process.env, stdio: 'inherit' })
      `npx tsx ${pathToSeed}`;
  }

  return { success: true };
};

export default runExecutor;
