import { PromiseExecutor } from '@nx/devkit';

import { $ } from 'execa';
import * as path from 'path';

import { DB_URL_REGEX } from './constants';
import { EnvSchema } from './env.dto';
import { PgDumpExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<PgDumpExecutorSchema> = async (options, context) => {
  const projectName = context.projectName;
  if (!projectName) {
    console.log('❌ No project name found. Aborting executor.');
    return { success: false };
  }

  const pathToLib = context.projectGraph.nodes[projectName].data.root;
  const pathToSeed = path.join(pathToLib, options.file);

  const envDto = EnvSchema.safeParse(process.env);
  if (!envDto.success) {
    console.error('🔒 Environment validation failed:', envDto.error);
    throw envDto.error;
  }

  const [, dbNameNoSchema, schema] = envDto.data.databaseUrl.match(DB_URL_REGEX) ?? [];

  await $({ env: process.env, stdio: 'inherit', shell: true })`
    pg_dump
      --dbname=${dbNameNoSchema}
      --data-only
      --format=custom
      --file=${pathToSeed}
      ${options.tables.map(table => `-t ${schema}.${table}`).join(' ')}
  `;

  return { success: true };
};

export default runExecutor;
