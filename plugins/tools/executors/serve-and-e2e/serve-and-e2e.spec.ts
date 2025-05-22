import { ExecutorContext } from '@nx/devkit';

import { ServeAndE2eExecutorSchema } from './schema';
import executor from './serve-and-e2e';

const options: ServeAndE2eExecutorSchema = {
  configuration: 'e2e',
  timeout: 15000,
};
const context: ExecutorContext = {
  root: '',
  cwd: process.cwd(),
  isVerbose: false,
  projectGraph: {
    nodes: {},
    dependencies: {},
  },
  projectsConfigurations: {
    projects: {},
    version: 2,
  },
  nxJsonConfiguration: {},
};

describe('ServeAndE2e Executor', () => {
  it('can run', async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
