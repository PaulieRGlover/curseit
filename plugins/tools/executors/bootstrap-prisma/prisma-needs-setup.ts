import { $ } from 'execa';

export const prismaNeedsSetup = async (pathToSchema: string): Promise<boolean> => {
  try {
    await $({ env: process.env, stdio: 'inherit' })`
      npx prisma migrate status --schema=${pathToSchema}
    `;

    return false;
  } catch {
    return true;
  }
};
