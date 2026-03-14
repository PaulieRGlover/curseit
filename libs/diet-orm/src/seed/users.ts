import { faker } from '@faker-js/faker';

import * as argon2 from 'argon2';
import { Prisma } from 'dist/index.js';

export const PRIME_USER_LOGIN = 'test@curseit.io';

export type UserWithPassword = Prisma.UserCreateManyInput & { password?: string };
export const getUsers = async (hashSecret: string): Promise<Array<UserWithPassword>> => [
  ...(await Promise.all([
    ...Array(100)
      .fill(null)
      .map(async () => {
        const password = faker.internet.password();
        const passwordHash = await argon2.hash(password, {
          secret: Buffer.from(hashSecret, 'utf-8'),
        });
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        return {
          login: faker.internet.email({ provider: 'seed.curseit.io' }),
          firstName,
          lastName,
          password,
          passwordHash,
        };
      }),
    ...[
      {
        login: PRIME_USER_LOGIN,
        firstName: 'Test',
        lastName: 'Testovic',
        password: 'eadeadeadA1!',
      },
      {
        login: 'test2@curseit.io',
        firstName: 'Test',
        lastName: 'Testovic',
        password: 'eadeadeadA1!',
      },
      {
        login: 'test3@curseit.io',
        firstName: 'Test',
        lastName: 'Testovic',
        password: 'eadeadeadA1!',
      },
    ].map(async ({ password, ...rest }) => {
      const passwordHash = await argon2.hash(password, {
        secret: Buffer.from(hashSecret, 'utf-8'),
      });
      return { password, passwordHash, ...rest };
    }),
  ])),
];
