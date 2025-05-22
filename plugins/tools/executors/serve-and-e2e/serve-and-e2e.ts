import { PromiseExecutor } from '@nx/devkit';

import { ServeAndE2eExecutorSchema } from './schema';
import { $ } from 'execa';
import * as waitOn from 'wait-on';
import { EnvSchema } from './env.dto';

const runExecutor: PromiseExecutor<ServeAndE2eExecutorSchema> = async (options, context) => {
  if (!context.projectName) {
    throw new Error(`Project has to have name`);
  }

  const serveTarget = options.serveTarget ?? context.projectName?.replace(/-e2e$/, '');

  const envDto = EnvSchema.safeParse(process.env);
  if (!envDto.success) {
    throw envDto.error;
  }

  const serve = $({ env: process.env, stdio: 'inherit' })
    `npx nx run ${serveTarget}:serve --configuration=${options.configuration}`;

  try {
    await waitOn({
      resources: [`http://localhost:${envDto.data.port}/api/health`],
      timeout: options.timeout,
    });
  } catch (error) {
    serve.kill();
    throw new Error(`Server did not start in time: ${error}`);
  }

  await $({ env: process.env, stdio: 'inherit' })
    `npx nx run ${context.projectName}:e2e`;

  serve.kill('SIGTERM');

  return { success: true };
};

export default runExecutor;
