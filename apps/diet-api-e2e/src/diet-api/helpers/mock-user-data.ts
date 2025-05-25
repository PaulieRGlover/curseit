import { faker } from '@faker-js/faker';

import { MockData } from '@curseit/testing';

export class MockUserData extends MockData {
  private static loginGenerator = MockData.createUniqueGenerator(() => {
    return faker.internet.email({ provider: 'e2e.curseit.io' });
  });

  private static passwordGenerator = MockData.createUniqueGenerator(faker.internet.password);

  public static get login() {
    return MockData.getNext(MockUserData.loginGenerator);
  }

  public static stableLogin = MockUserData.login;

  public static get password() {
    return MockData.getNext(MockUserData.passwordGenerator);
  }
}
