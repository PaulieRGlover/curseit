import { PrismaClient } from '../../dist/index.js';
import { EnvSchema } from './env.dto.js';
import { getUsers, UserWithPassword } from './users.js';

const client = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

async function main() {
  const envDto = EnvSchema.safeParse(process.env);
  if (!envDto.success) {
    throw envDto.error;
  }

  await client.user.deleteMany({ where: {} });

  const users = await getUsers(envDto.data.hashSecret);
  const getExcerpt = (user: UserWithPassword) => `\n\t${user.login}\n\t${user.password}`;
  const excerpt = [users[0], users[1], users[2]].reduce(
    (excerpt, user) => excerpt += getExcerpt(user),
    '',
  );
  users.forEach(user => delete user.password);
  const result = await client.user.createMany({
    data: users,
  });

  console.log(`✅ Successfully seeded ${result.count} users:${excerpt}`);
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
