import { ExecutorContext } from '@nx/devkit';

import executor from './bootstrap-prisma';
import { BootstrapPrismaExecutorSchema } from './schema';

const options: BootstrapPrismaExecutorSchema = {
  reset: false,
  seed: false,
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

describe('BootstrapPrisma Executor', () => {
  it('can run', async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
