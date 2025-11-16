import { MockData } from './mock-data.js';

const createMockGenerator = function* (array: Array<unknown>) {
  for (const item of array) {
    yield item;
  }
};

const mockGenerate = (mockGenerator: Generator) => {
  const result = mockGenerator.next();

  return result.value;
};

const getExampleMockData = (mockGenerator: Generator) => {
  return class ExampleMockData extends MockData {
    private static generator = MockData._createUniqueGenerator(() => mockGenerate(mockGenerator));

    public static get item() {
      return MockData._getNext(ExampleMockData.generator);
    }
  };
};

describe('MockData inheritor', () => {
  it('yields unique data from specified getter', () => {
    const ExampleMockData = getExampleMockData(createMockGenerator([0, 0, 1, 2, 2, 2, 2]));

    expect(ExampleMockData.item).toBe(0);
    expect(ExampleMockData.item).toBe(1);
    expect(ExampleMockData.item).toBe(2);
  });

  it("throws an error when uniqueness can't be reached", () => {
    const array = new Array(200).fill(5);
    const ExampleMockData = getExampleMockData(createMockGenerator(array));

    expect(ExampleMockData.item).toBe(5);
    expect(() => ExampleMockData.item).toThrow();
  });
});
