import { faker } from '@faker-js/faker';

import { sequence } from './sequence.js';

describe('sequence', () => {
  it.each(
    Array.from({ length: 6 }, () => faker.number.int({ min: 5, max: 50 })),
  )('creates an array filled with integers from 0 to %s', length => {
    const array = sequence(length);
    const randomIndex = faker.number.int({ max: length }) - 1;

    expect(array.length).toBe(length);
    expect(array[randomIndex]).toBe(randomIndex);
  });
});
