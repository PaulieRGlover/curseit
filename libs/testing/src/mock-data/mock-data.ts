export abstract class MockData {
  private static MAX_ATTEMPTS = 100;

  protected static* _createUniqueGenerator<T>(generate: () => T): Generator<T> {
    const seen = new Set<T>();
    let attempts = 0;
    while (attempts < MockData.MAX_ATTEMPTS) {
      attempts++;

      const value = generate();
      if (!seen.has(value)) {
        seen.add(value);
        attempts = 0;
        yield value;
      }
    }
  }

  protected static _getNext<T>(generator: Generator<T>): T {
    const result = generator.next();
    if (result.done) {
      throw new Error("Generator can't provide unique items anymore");
    }

    return result.value;
  }
}
