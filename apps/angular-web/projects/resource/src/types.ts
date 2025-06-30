export type ApiResult<T, U> = Promise<
  { success: T, failure?: never } |
  { success?: never, failure: U }
>;
