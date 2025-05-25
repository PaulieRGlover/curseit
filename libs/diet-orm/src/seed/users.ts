import { faker } from '@faker-js/faker';
import * as argon2 from 'argon2';
import { Prisma } from 'dist/index.js';

export type UserWithPassword = Prisma.UserCreateManyInput & { password?: string };
export const getUsers = async (hashSecret: string): Promise<Array<UserWithPassword>> => ([
  ...(await Promise.all(Array(100).fill(null).map(async () => {
    const password = faker.internet.password();
    const passwordHash = await argon2.hash(password, { secret: Buffer.from(hashSecret, 'utf-8') });
    return {
      login: faker.internet.email({ provider: 'seed.curseit.io' }),
      password,
      passwordHash,
    };
  }))),
  {
    login: 'test@curseit.io',
    password: 'test',
    passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$Gk1FoPbRSz2Z9WJRbRDKaw$zu+z+mRdXwS9DXgv3a6jSjdlRtHudnP7P0LXOV3vT6Q',
  },
  {
    login: 'test2@curseit.io',
    password: 'test',
    passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$Gk1FoPbRSz2Z9WJRbRDKaw$zu+z+mRdXwS9DXgv3a6jSjdlRtHudnP7P0LXOV3vT6Q',
  },
  {
    login: 'test3@curseit.io',
    password: 'test',
    passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$Gk1FoPbRSz2Z9WJRbRDKaw$zu+z+mRdXwS9DXgv3a6jSjdlRtHudnP7P0LXOV3vT6Q',
  },
]);
