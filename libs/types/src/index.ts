export type Nullable<T> = T | null;
export type MaybeUndefined<T> = T | undefined;
export type RequiredProperties<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: T[P] };
