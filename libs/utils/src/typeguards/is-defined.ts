export const isDefined = <T>(value: T | undefined): value is T => {
  return value !== undefined;
};

export const isNotNull = <T>(value: T | null): value is T => {
  return value !== null;
};

export const isNotNullish = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

export const isTruthy = <T>(value: T | null | undefined | 0 | '' | typeof NaN): value is T => {
  return Boolean(value);
};
